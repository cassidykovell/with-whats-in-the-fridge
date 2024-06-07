import { gql } from '@apollo/client';

export const LOGIN_USER = gql `
mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
      }
    }
  }

mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        email
        id
        username
      }
    }
  }

  mutation Mutation($userId: ID!, $title: String!, $description: String!, $ingredients: [String!]!, $instructions: String!) {
    createRecipe(userId: $userId, title: $title, description: $description, ingredients: $ingredients, instructions: $instructions) {
      createdAt
      createdBy {
        username
      }
      description
      id
      ingredients
      instructions
      title
    }
  }
`