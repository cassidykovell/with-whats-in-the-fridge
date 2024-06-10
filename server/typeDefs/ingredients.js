const ingredientsTypeDefs = `
  type Ingredient {
    id: ID!
    name: String!
    image: String
  }

  extend type Query {
    getIngredients(query: String!): [Ingredient]
  }
`;

module.exports = ingredientsTypeDefs;
