const jsnx = require('jsnetworkx')
const utils = require('./utils')

/**
 * Extracts the metabolite names from a list of reactions
 * The elements of the returned list are unique.
 * @param reactions 
 */
const reactionsMetabolites = (reactions) => {
  const allMetabolites = reactions
    .map(r => Object.keys(r.metabolites))
    // Flatten the Array of Arrays
    // Enforce `Array.prototype.concat` binarity.
    .reduce((acc, next) => Array.prototype.concat(acc, next), [])
  // Make it unique
  return Array.from(new Set(allMetabolites))
}

/**
 * Groups reactions by metabolite name
 * @param reactions 
 * @param metabolites 
 */
const groupReactionsByMetabolite = (reactions, metabolites) => {
  return Object.assign({},
    ...metabolites.map((m) => ({ [m]: reactions.filter(r => r.metabolites.hasOwnProperty(m)) })
  ))
}

/**
 * Returns metabolites with 2 or more reactions
 * @param reactionsByMetabolite 
 */
const obtainCofactors = (reactionsByMetabolite) => {
  return Object.entries(reactionsByMetabolite)
    .filter(([metabolite, reactions]) => reactions.length > 2)
    .map(([metabolite]) => metabolite)
}

/**
 * Returns all metabolites from the opposite side of the equation
 * @param metabolites 
 * @param metabolite 
 */
const oppositeMetabolites = (metabolites, metabolite) => {
  return Object.entries(metabolites)
    .filter(([m, stoich]) => stoich * metabolites[metabolite] < 0)
    .map(([m]) => m)
}

/**
 * Returns all non cofactor metabiltes from the opposite side of the reaction equation.
 * @param {*} metabolites 
 * @param {*} metabolite 
 * @param {*} cofactors 
 */
const notSecondaryMetabolites = (metabolites, metabolite, customCofactors) => {
  return oppositeMetabolites(metabolites, metabolite)
    .filter(m => utils.isMetabolite(m) && !customCofactors.has(m))
}

/**
 * DFS algorithm that traverses the map.
 * Only follows metabolites with only one non-visited reactions.
 * The actual outputs are traversalState.graph and traversalState.primaryNodes
 * @param {*} prevReaction 
 * @param {*} traversalState 
 * @param {*} metabolite 
 */
const fillReactionsGraph = (prevReaction, traversalState, metabolite) => {
  const nodeReactions = traversalState.reactionsByMetabolite[metabolite]
    .filter(reaction => !traversalState.visitedReactions.has(reaction.name))

  // if metabolite participates in more than in 2 reactions in this pathway, it is a cofactor
  // if metabolite participates in less than in 2 reactions, it is a cofactor or the end product
  if (nodeReactions.length !== 1) {
    return traversalState
  }

  const [reaction] = nodeReactions
  traversalState.graph.addEdge(reaction.id, prevReaction.id)

  traversalState = Object.assign({}, traversalState, {
    visitedReactions: new Set([...traversalState.visitedReactions, reaction.name]),
    primaryNodes: Object.assign({}, traversalState.primaryNodes, { [reaction.id]: metabolite }),
    reactionParent: Object.assign({}, traversalState.reactionParent, { [reaction.id]: prevReaction.id })
  })

  const primaryMetabolites = notSecondaryMetabolites(
    reaction.metabolites, metabolite, traversalState.customCofactors
  )
  return primaryMetabolites
    .reduce((ts, m) => fillReactionsGraph(reaction, ts, m), traversalState)
}

/**
 * Finds the route to the product. The return value is a 
 * list of reactions (that lead to the product)
 * and the corresponding primary nodes
 * @param {*} reactions 
 * @param {*} productId 
 */
const sortedReactionsProducts = (reactions, productId) => {
  const metabolites = reactionsMetabolites(reactions)
  const reactionsByMetabolite = groupReactionsByMetabolite(reactions, metabolites)
  const customCofactors = new Set(obtainCofactors(reactionsByMetabolite))

  const graph = new jsnx.DiGraph()

  const [startReaction] = reactionsByMetabolite[productId]
  graph.addNode(startReaction.id)

  let traversalState = {
    graph: graph,
    visitedReactions: new Set([startReaction.name]),
    primaryNodes: { [startReaction.id]: productId },
    reactionsByMetabolite,
    customCofactors,
    reactionParent: new Set()
  }
  const primaryMetabolites = notSecondaryMetabolites(startReaction.metabolites, productId, customCofactors)
  traversalState = primaryMetabolites
    .reduce((ts, m) => fillReactionsGraph(startReaction, ts, m), traversalState)

  const sortedReactions = jsnx.topologicalSort(traversalState.graph)

  return sortedReactions.map((reaction) => ({
    reaction,
    node: traversalState.primaryNodes[reaction],
    parent: traversalState.reactionParent[reaction]
  })).slice().reverse()
}
const PathwayGraph = {
  reactionsMetabolites: reactionsMetabolites,
  groupReactionsByMetabolite: groupReactionsByMetabolite,
  obtainCofactors: obtainCofactors,
  oppositeMetabolites: oppositeMetabolites,
  notSecondaryMetabolites: notSecondaryMetabolites,
  fillReactionsnGraph: fillReactionsGraph,
  sortedReactionsProducts: sortedReactionsProducts
}

module.exports = PathwayGraph
