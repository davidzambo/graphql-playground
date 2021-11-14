export const feed = async (parent, args, context) => {
  const where = args.filter ? {
    OR: [
      { description: { contains: args.filter } },
      { url: { contains: args.filter } }
    ]
  } : {}
  return await context.prisma.link.findMany({ where })
}
