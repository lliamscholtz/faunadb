import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import { faker } from '@faker-js/faker';

import faunadb from 'faunadb';
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET,
});
const {
    Get,
    Ref,
    Collection,
    Map,
    Paginate,
    Documents,
    Match,
    Join,
    Lambda,
    Index,
    Select,
    Create,
    Call,
    Function: Fn,
} = faunadb.query;

// Redirect from root
app.get('/', function (req, res) {
    res.redirect('/users');
});

// Returns all users
app.get('/users', async (req, res) => {
    try {
        const doc = await client.query(
            Map(
                Paginate(Documents(Collection('users'))),
                Lambda((x) => Get(x))
            )
        );
        res.send(doc);
    } catch (err) {
        res.send(err);
    }
});

// Search for user by name
app.get('/users/search/:name', async (req, res) => {
    try {
        const doc = await client.query(
            Select(
                ['data'],
                Get(Match(Index('users_by_name'), req.params.name))
            )
        );
        res.send(doc);
    } catch (err) {
        res.send(err);
    }
});

// Returns a single user by id
app.get('/users/:id', async (req, res) => {
    try {
        const doc = await client.query(
            Select(['data'], Get(Ref(Collection('users'), req.params.id)))
        );
        res.send(doc);
    } catch (err) {
        res.send(err);
    }
});

app.get('/phrases', async (req, res) => {
    const doc = await client.query(
        // Get all user names
        // Map(
        //     Paginate(Documents(Collection('users'))),
        //     Lambda((x) => Select(['data', 'name'], Get(x)))
        // )

        // Get all phrases by user with join
        // Paginate(
        //     Join(
        //         Match(Index('users_by_name'), 'kevin'),
        //         Index('phrases_by_user')
        //     )
        // )

        // Get all users and join phrases to show all phrases
        Paginate(Join(Documents(Collection('users')), Index('phrases_by_user')))
    );
    res.send(doc);
});

app.get('/phrases/create', async (req, res) => {
    const users = ['kevin', 'adrian', 'albert'];
    var randomUser = users[Math.floor(Math.random() * users.length)];

    const data = {
        user: Select('ref', Get(Match(Index('users_by_name'), randomUser))),
        text: faker.hacker.phrase(),
    };
    const doc = await client.query(Create(Collection('phrases'), { data }));

    res.send(doc);
});

app.get('/phrases/:name', async (req, res) => {
    // Create getUser function on dashboard.fauna.com
    // Query(Lambda("user", Select("ref", Get(Match(Index("users_by_name"), Var("user"))))))
    const doc = await client.query(
        Paginate(
            Match(
                Index('phrases_by_user'),
                Call(Fn('getUser'), req.params.name)
            )
        )
    );
    res.send(doc);
});

app.listen(5000, () => {
    console.log(
        `[+++} ${faker.hacker.phrase()} I'll also get the API running on http://localhost:5000`
    );
});
