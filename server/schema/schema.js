const graphql = require('graphql');
const mongoose = require('mongoose');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');
const author = require('../models/author');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList } = graphql;

// connect to db 
const db = process.env.MangoDB
mongoose.connect(db)
mongoose.connection.once('open', () => {
    console.log('connected to database')
})


// dummy data
// var books = [
//     {name: 'The Three-Body Problem', genre:'sci-fi', id:'1', authorId: '2'},
//     {name: 'The Dark Forest', genre:'sci-fi', id:'2', authorId: '2'},
//     {name: "Death's End", genre:'sci-fi', id:'3', authorId: '2'},
//     {name: "A Philosophy of Software Design", genre:'educational', id:'4', authorId: '1'},
// ]

// var authors = [
//     {name: "John Ousterhout", country:'US', id:'1'},
//     {name: "Liu Cixin", country:'China', id:'2'},
// ]


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId)
                // return _.find(authors, {id:parent.authorId})
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        country: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({ authorId: parent.id })
                // return _.filter(books, {authorId:parent.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db/other source
                return Book.findById(args.id);
                // return _.find(books, {id:args.id});
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Author.findById(args.id);
                // return _.find(authors, {id:args.id});
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return Author.find({});
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                country: { type: GraphQLString },
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    country: args.country
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});