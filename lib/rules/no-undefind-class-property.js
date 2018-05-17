module.exports = {
  meta: {
    docs: {
      description: 'Disallow use of undefined class properties and methods',
      category: 'Best Practices',
      recommended: true
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedMethods: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
            uniqueItems: true
          }
        }
      }
    ]
  },
  create (context) {
    return {
      'ClassBody ThisExpression' (node) {
        const property = node.parent.property.name
        const classBodyNode = getClassBody(node)
        const className = classBodyNode.parent.id.name
        const [{allowedProperties = []} = {}] = context.options
        if (getClassProps(classBodyNode).includes(property) || allowedProperties.includes(property)) {
          return
        }
        context.report(node.parent.property, `property "${property}" doesn't exists on class "${className}"`)
      }
    }
  }
}

function getClassProps (classBodyNode) {
  return (classBodyNode.body.map(item => item.key.name))
}

function getClassBody (node) {
  if (node.parent.type === 'ClassBody') {
    return node.parent
  }
  return getClassBody(node.parent)
}
