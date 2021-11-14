export const postedBy = async (parent, args, context) => {
  return context
    .prisma
    .link
    .findUnique({ where: { id: parent.id }})
    .postedBy()
}

export const votes = async (parent, args, context) => {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).votes();
}
