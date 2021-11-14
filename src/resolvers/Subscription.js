const newLinkSubscribe = (connectionParams, webSocket, context) => {
  return context.pubsub.asyncIterator(["NEW_LINK"]);
}

const newVoteSubscribe = (connectionParams, webSocket, context) => {
  return context.pubsub.asyncIterator("NEW_VOTE")
}

export const newLink = {
  subscribe: newLinkSubscribe,
  resolve: payload => payload
}

export const newVote = {
  subscribe: newVoteSubscribe,
  resolve: payload => payload
}
