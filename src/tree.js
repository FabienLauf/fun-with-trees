/* Imported Libs & Global vars
** ************************************** */
const React = React
const ReactDOM = ReactDOM
const { connect, Provider } = ReactRedux
const thunkMiddleware = ReduxThunk.default
const { compose, createStore, applyMiddleware } = Redux
const domContainerNode = document.getElementById('react-app')

const minValue = 1
const maxValue = 99

/* Helper Functions
** ************************************** */
const always = x => y => x

const toUpper = str => str.toUpperCase()

const slice = (i, j, coll) => coll.slice(i, j)

const capitalize = str =>
    `${toUpper(str.charAt(0))}${slice(1, Infinity, str)}`

const getNestedValue = (keyPath, obj = {}) =>
    keyPath
        .trim()
        .split('.').reduce((acc, curr) =>
        acc[curr], obj)

const zeroPadDigit = num =>
    num < 10
        ? num > -10 && num < 0
        ? String('-0' + num) // negative digits
        : String('0' + num)  // positive digits
        : String(num)

const getIntRange = (start = 0, count = 99) =>
    Array(count + 1)
        .fill()
        .map((_, i) => i + start)

const getRandomInt = (min = minValue, max = maxValue) =>
    Math.floor(Math.random() * (max - min + 1)) + min

const getRandomArray = (length = 10, min, max) =>
    Array(length)
        .fill()
        .map(getRandomInt.bind(null, min, max))

const mapKeysToObject = (keys, func, obj = {}) =>
    keys.reduce((acc, curr) => {
        acc[curr] = func(curr); return acc }, obj)

/* Data Structures
** ************************************** */
const BinarySearchTreeNode = value =>
    ({
        value,
        left: null,
        right: null,
        parent: null
    })

const BinarySearchTree = (root, autobalancing = false) =>
    ({
        root,
        autobalancing,
        find: function (value) {
            let found = false
            let current = this.root

            while (!found && current) {
                if (value < current.value)
                    current = current.left
                else if (value > current.value)
                    current = current.right
                else
                    found = true
            }

            return found && current
        },
        traverseInOrder: function (callback, startNode = this.root) {
            const inOrder = node => {
                if (node) {
                    if (node.left)                    // traverse the left subtree
                        inOrder(node.left)

                    callback.call(this, node)         // process the callback on the current node

                    if (node.right)                   // traverse the right subtree
                        inOrder(node.right)
                }
            }

            inOrder(startNode)
        },
        traverseByDepth: function (callback, startNode = this.root) {
            const byDepth = (...nodes) => {
                if (nodes.length) {
                    callback.call(this, nodes)
                    const nextNodes = nodes.reduce((nextLevel, node) => {
                        if (node.left)
                            nextLevel.push(node.left)
                        if (node.right)
                            nextLevel.push(node.right)
                        return nextLevel
                    }, [])
                    byDepth(...nextNodes)
                }
            }

            byDepth(startNode)
        },
        getValues: function (startNode = this.root) {
            const values = []
            this.traverseInOrder(startNode => values.push(node.value))
            return values
        },
        getMinNode: function (node = this.root) {
            return node.left ? this.getMinNode(node.left) : node
        },
        getMaxNode: function (node = this.root) {
            return node.right ? this.getMaxNode(node.right) : node
        },
        resetParents: function () {
            this.traverseInOrder(node => {
                if (node === this.root)
                    node.parent = null
                if (node.left)
                    node.left.parent = node
                if (node.right)
                    node.right.parent = node
            })
        },
        getNodeSide: function ({parent, value}) {
            if (parent)
                return value < parent.value ? 'left' : 'right'
            return 'root'
        },
        getHeight: function (startNode = this.root) {
            let height = 0
            if (!startNode)
                return height
            this.traverseByDepth(nodes => height++, startNode)
            return height
        },
        getBalanceFactor: function (startNode = this.root) {
            const leftSubtreeHeight = startNode.left
                ? this.getHeight(startNode.left) : 0
            const rightSubtreeHeight = startNode.right
                ? this.getHeight(startNode.right) : 0

            return rightSubtreeHeight - leftSubtreeHeight     // a node with a balance factor 1, 0, or -1 is considered balanced
        },
        rotateLeft: function (parentNode) {
            const pivotNode = parentNode.right                // Let ParentNode be PivotNode's right child
            parentNode.right = pivotNode.left                 // Set PivotNode's right child to be ParentNode's left child

            if (parentNode.right && parentNode.right.parent)  // Set ParentNode's left-child's parent to PivotNode
                parentNode.right.parent = parentNode

            pivotNode.left = parentNode                       // Set ParentNode's left child to be PivotNode

            if (parentNode.parent)                            // Set PivotNode's parent to ParentNode
                parentNode.parent[this.getNodeSide(parentNode)] = pivotNode
            else
                this.root = pivotNode

            this.resetParents()                               // Reset parent references
        },
        rotateRight: function (parentNode) {
            const pivotNode = parentNode.left                 // Let PivotNode be ParentNode's left child.
            parentNode.left = pivotNode.right                 // Set ParentNode's left child to be PivotNode's right child

            if (parentNode.left && parentNode.left.parent)    // Set PivotNode's right-child's parent to ParentNode
                parentNode.left.parent = parentNode

            pivotNode.right = parentNode                      // Set PivotNode's right child to be ParentNode

            if (parentNode.parent)                            // Set PivotNode's parent to ParentNode
                parentNode.parent[this.getNodeSide(parentNode)] = pivotNode
            else
                this.root = pivotNode

            this.resetParents()                               // Reset parent references
        },
        rotate: function (direction, node) {
            if (direction === 'left')
                this.rotateLeft(node)
            if (direction === 'right')
                this.rotateRight(node)
        },
        balance: function (node) {
            if (node) {
                const parentBalanceFactor = this.getBalanceFactor(node)

                if (parentBalanceFactor < -1) {                 // parent node is heavy on the left
                    if (this.getBalanceFactor(node.left) > 0)     // pivot node is heavy on the right
                        this.rotateLeft(node.left)                  // left-right rotation
                    this.rotateRight(node)                        // left-left rotation
                }

                if (parentBalanceFactor > 1) {                  // parent node is heavy on the right
                    if (this.getBalanceFactor(node.right) < 0)    // pivot node is heavy on the left
                        this.rotateRight(node.right)                // right-left rotation
                    this.rotateLeft(node)                         // right-right rotation
                }

                return this.balance(node.parent)
            }
        },
        add: function (value) {
            const node = BinarySearchTreeNode(value)
            let current = this.root

            if (!current)                                     // set root if none exists
                this.root = node
            else
                while (value !== current.value) {               // traverse the tree
                    const side = value < current.value ? 'left' : 'right'
                    if (!current[side]) {
                        node.parent = current
                        current[side] = node                        // add the node
                    }
                    current = current[side]
                }

            if (node.parent && this.autobalancing)
                this.balance(node.parent)
        },
        remove: function (value) {
            const node = this.find(value)             // Search for node to remove
            if (!node) return                         // Exit if no node is found

            const side = this.getNodeSide(node)
            const leftChild = node.left
            const rightChild = node.right
            const numChildren = [leftChild, rightChild].reduce((acc, curr) =>
                curr ? ++acc : acc, 0)

            switch (numChildren) {                    // Handle one of 3 cases
                case 0 : node.parent                    // 1. Node has zero children
                    ? node.parent[side] = null
                    : this.root = null
                    break
                case 1 : node.parent                    // 2. Node has one child
                    ? node.parent[side] = leftChild || rightChild
                    : this.root = leftChild || rightChild
                    break
                case 2 :                                // 3. Node has two children
                    const minNodeValue = this.getMinNode(rightChild).value
                    this.remove(minNodeValue)
                    node.value = minNodeValue
                    break
            }

            this.resetParents()                       // Reset parent references
            if (node.parent && this.autobalancing)
                this.balance(node.parent)
        }
    })

/* Action Creators, Initial State & Reducers
** ************************************** */
const treeActionCreators = {
    add: dispatch =>
        payload =>
            dispatch({ type: 'ADD_NODE', payload }),
    remove: dispatch =>
        payload =>
            dispatch({ type: 'REMOVE_NODE', payload }),
    rotate: dispatch =>
        payload =>
            dispatch({ type: 'ROTATE_NODE', payload })
}

const metaActionCreators = {
    changeValue: dispatch =>
        payload =>
            dispatch({ type: 'CHANGE_VALUE', payload }),
    changeActive: dispatch =>
        payload =>
            dispatch({ type: 'CHANGE_ACTIVE', payload }),
    toggleBalanced: dispatch =>
        payload =>
            dispatch({ type: 'TOGGLE_BALANCED', payload })
}

const actionCreators = {
    ...treeActionCreators,
    ...metaActionCreators
}

const seedValues = compose(getRandomArray, getRandomInt)(3, 6)                        // make a small set of random seed values

const tree = compose(BinarySearchTree, BinarySearchTreeNode)(seedValues[0])           // create initial trees; use first seed value as root
const balancedTree = BinarySearchTree(BinarySearchTreeNode(seedValues[0]), true)

for (let value of seedValues.slice(1)) {                                              // seed the tree, with remaining values
    tree.add(value)
    balancedTree.add(value)
}

const initialState = {
    tree,
    balancedTree,
    meta: {
        balanced: true,
        currValue: null,
        activeValue: null,
        containedValues: mapKeysToObject(seedValues, always(true)),
        availableValues: getIntRange(minValue, maxValue - minValue)
    }
}

const rootReducer = (state = initialState, {type, payload}) => {
    const newState = Object.assign({}, state)
    const treeKey = newState.meta.balanced ? 'balancedTree' : 'tree'

    switch (type) {
        case 'ADD_NODE':
            newState.tree = BinarySearchTree(newState.tree.root)
            newState.tree.add(payload)
            newState.balancedTree = BinarySearchTree(newState.balancedTree.root, true)
            newState.balancedTree.add(payload)
            newState.meta.containedValues[payload] = true
            return newState

        case 'REMOVE_NODE':
            const nodeToRemove = newState[treeKey].find(payload)
            const nodeToRemoveParent = nodeToRemove.parent
            const nodeSide = newState[treeKey].getNodeSide(nodeToRemove)
            newState.tree = BinarySearchTree(newState.tree.root)
            newState.tree.remove(payload)
            newState.balancedTree = BinarySearchTree(newState.balancedTree.root)
            newState.balancedTree.remove(payload)
            delete newState.meta.containedValues[payload]
            newState.meta.activeValue = nodeToRemoveParent &&
                nodeToRemoveParent[nodeSide] && nodeToRemoveParent[nodeSide].value
            return newState

        case 'ROTATE_NODE':
            const pivotDirection = payload.direction === 'left' ? 'right' : 'left'
            const newActiveValue = payload.node[pivotDirection].value
            newState[treeKey] = BinarySearchTree(newState[treeKey].root)
            newState[treeKey].rotate(payload.direction, payload.node)
            newState.meta.activeValue = newActiveValue
            return newState

        case 'TOGGLE_BALANCED':
            newState.meta.balanced = !newState.meta.balanced
            return newState

        case 'CHANGE_VALUE':
            newState.meta.currValue = payload
            return newState

        case 'CHANGE_ACTIVE':
            newState.meta.activeValue = payload
            return newState

        default:
            return newState
    }
}

/* Redux Middleware & Store
** ************************************** */
const thunk = thunkMiddleware

const logger = window.reduxLogger
    ? window.reduxLogger({
        collapsed: (getState, action) =>
            true,
        predicate: (getState, {type}) =>
            type !== 'CHANGE_VALUE' &&
            type !== 'CHANGE_ACTIVE' &&
            type !== 'TOGGLE_BALANCED'
    })
    : ({dispatch, getState}) =>
        next =>
            action => {
                console.log({'Action Type': action.type, 'Updated State': getState()})
                return next(action) }

const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, logger)
)


/* Displays -- stateless or "dumb" components
** ************************************** */
const PrettyArray = ({values, activeValue, tree}) =>
    <div className='pretty-array'>
        <span className='bracket'>[</span>
        { values.map((value, i) =>
            <span className='value-and-comma' key={i}>
          { i > 0 ? <span className='comma'>,&nbsp;</span> : null }
                <span
                    className={
                        'value ' +
                        (value === activeValue ? 'active ' : ' ') +
                        ((tree.root && tree.root.value === value) && 'root')
                    }
                >
            { zeroPadDigit(value) }
          </span>
        </span>)
        }
        <span className='bracket'>]</span>
    </div>

const RotateButton = ({direction = 'left', onClick}) =>
    <span className='rotate-btn' onClick={onClick}>
    <i className={'fa fa-rotate-' + direction} />
  </span>

const RemoveButton = ({onClick}) =>
    <span className='close-btn' onClick={onClick} >
    <i className='fa fa-close' />
  </span>

const NodeLabel = props =>
    <label className='node-label'
           onMouseEnter={e =>
               props.changeActive(props.node.value)}
           onMouseLeave={e =>
               props.changeActive(null)}
    >
        { props.balanceFactor > 0
            ? <RotateButton
                direction='left'
                onClick={e =>
                    props.rotate({direction: 'left', node: props.node}) }
            /> : null
        }
        { props.balanceFactor < 0
            ? <RotateButton
                direction='right'
                onClick={e =>
                    props.rotate({direction: 'right', node: props.node}) }
            /> : null
        }
        <RemoveButton onClick={e => props.remove(props.node.value)} />
        { zeroPadDigit(props.node.value) }
    </label>

const NodeChild = props =>
    <li className='flex-item'>
        { props.node[props.side] ? <Line side={props.side} /> : null }
        { props.node[props.side]
            ? <Node
                {...props}
                node={props.node[props.side]}
                balanceFactor={props.tree.getBalanceFactor(props.node[props.side])}
            /> : null
        }
    </li>

const NodeChildren = props =>
    <ol className='flex-container'>
        <NodeChild {...props} side='left' />
        <NodeChild {...props} side='right' />
    </ol>

const Node = props =>
    <div className='node'>
        <NodeLabel {...props} />
        <NodeChildren {...props} />
    </div>

const Tree = props =>
    <div className='tree'>
        { props.tree.root
            ? <Node
                tree={props.tree}
                node={props.tree.root}
                balanceFactor={props.tree.getBalanceFactor()}

                remove={props.remove}
                rotate={props.rotate}
                changeActive={props.changeActive}
            /> : null
        }
    </div>

const Heading = ({children}) =>
    <h1 className='heading'>{children}</h1>

const Select = ({onChange, placeholder, options = []}) =>
    <select onChange={onChange} defaultValue='placeholder'>
        { placeholder
            ? <option value='placeholder' disabled>{placeholder}</option>
            : null }
        { options.map(({value, disabled, label}, i) =>
            <option value={value} disabled={disabled} key={i}>{label}</option>) }
    </select>

const Checkbox = ({checked = true, onClick, children}) =>
    <div className='checkbox'>
        <label className={'box ' + (checked && 'checked')} onClick={onClick}>
            { checked ? <i className='check fa fa-check' /> : null }
        </label>
        <label className='toggle-label'>
            { children || 'Accept' }
        </label>
    </div>

const SubmitButton = ({onClick, disabled, children}) =>
    <button
        className='submit-btn'
        type='submit'
        onClick={onClick}
        disabled={disabled}
    >
        { children || 'Submit' }
    </button>

const Controls = props =>
    <form className='controls'>
        <fieldset>
            <CurrValueSelector />
            <CurrValueAddSubmitButton />
        </fieldset>
        <fieldset>
            <AutoBalancingCheckbox />
        </fieldset>
    </form>

/* Connector Creators & Providers -- connecting functions for decorating Containers
** ************************************** */
const createValueInStateConnector = (
    valuePath,                                  // '.' delimited path to value
    propName = valuePath.split('.').pop(),      // name of property in connector
    valueTransformer = (v, state) => v          // function to transform value
) =>
    connect(
        state =>
            ({ [propName]: valueTransformer(
                    getNestedValue(
                        valuePath, state
                    ), state)
            }) )

const createValueToPropConnector = (value, propName) =>
    createValueInStateConnector('', propName, _ => value)

const createActionConnector = (actionName, propName = actionName) =>
    connect(null, dispatch =>
        ({ [propName]: actionCreators[actionName](dispatch) }) )

const createTransformedActionConnector = (
    actionName,                                 // key of action in actionCreators
    propName = actionName,                      // name of action in connector
    actionTransformer = (a, state) => a         // function to transform action
) =>
    connect(
        state => ({ state }),
        dispatch => ({ dispatch }),
        ({ state }, { dispatch }) =>
            ({ [propName]: actionTransformer(
                    actionCreators[actionName](dispatch),
                    state)
            }) )

const connectTreeState = createValueInStateConnector('meta.balanced', 'tree',
    (balanced, {balancedTree, tree}) => balanced ? balancedTree : tree )

const connectActionCallAsOnClick = actionName => createTransformedActionConnector(actionName, 'onClick',
    (action, { meta: { currValue }}) => e => {
        e.preventDefault()
        action(currValue)
    })

/* Containers -- decorated or "smart" components
** ************************************** */
const CurrTree = compose(
    connectTreeState,
    createActionConnector('remove'),
    createActionConnector('rotate'),
    createActionConnector('changeActive')
)(Tree)

const CurrValueSelector = compose(
    createTransformedActionConnector('changeValue', 'onChange',
        (onChange, state) => compose(onChange, e => parseInt(e.target.value) || 0) ),
    createValueToPropConnector('Values', 'placeholder'),
    createValueInStateConnector('meta', 'options',
        ({containedValues, availableValues}) =>
            availableValues.map(value => ({ value, label: zeroPadDigit(value), disabled: containedValues[value] }) ) )
)(Select)

const AutoBalancingCheckbox = compose(
    connectActionCallAsOnClick('toggleBalanced'),
    createValueToPropConnector('Auto-Balance', 'children'),
    createValueInStateConnector('meta.balanced', 'checked')
)(Checkbox)

const CurrValueAddSubmitButton = compose(
    connectActionCallAsOnClick('add'),
    createValueInStateConnector('meta', 'disabled',
        ({currValue, containedValues}) => typeof currValue !== 'number' || containedValues[currValue] ),
    createValueToPropConnector('Add', 'children')
)(SubmitButton)

const CurrValuesArray = compose(
    connectTreeState,
    createValueInStateConnector('meta.activeValue'),
    createValueInStateConnector('meta.containedValues', 'values',
        containedValues => Object.keys(containedValues).map(v => parseInt(v)) )
)(PrettyArray)

const Line = React.createClass({
    getDefaultProps () { return { side: 'root' } },
    getInitialState () { return { rotation: 30 } },
    componentDidMount () {
        window.addEventListener('resize', this.updateRotation)
        this.updateRotation()
    },
    componentWillUnmount () {
        window.removeEventListener('resize', this.updateRotation)
    },
    updateRotation () {
        const opp = 100
        const adj = this.el.offsetWidth
        const rotation = Math.atan(opp / adj)
        this.setState({rotation})
    },
    render () {
        const offsetX = -25
        const offsetY = -25
        const scaleX = this.props.side === 'left' ? -1 : 1
        return <div
            className={'line ' + this.props.side}
            ref={el => this.el = el}
            style={{
                transform: `
          rotate(${this.state.rotation * scaleX}rad)
          translateX(${offsetX * scaleX}px)
          translateY(${offsetY}px)`
            }}
        />
    }
})

/* Main App component
** ************************************** */
const App = props =>
    <main>
        <Heading>Binary Tree</Heading>
        <Controls />
        <CurrValuesArray />
        <CurrTree />
    </main>

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    domContainerNode
)