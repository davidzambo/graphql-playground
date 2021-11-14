import {loadSchema} from '@graphql-tools/load';
import {dirname, join} from 'path';
import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = await loadSchema(
  join(__dirname, './schema.graphql'), {
    loaders: [
      new GraphQLFileLoader()
    ]
  }
);

export default typeDefs;
