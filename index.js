const cors = require("micro-cors")();
const { send, json } = require("micro");
const { router, get, post, del } = require("microrouter");
const { ulid } = require("ulid");

const db = require("./db");

const r404 = (_, res) => send(res, 404);

module.exports = cors(router(
    get("/ping", (_, res) => send(res, 200, {
        version: revision = require('child_process')
            .execSync('git rev-parse HEAD')
            .toString().trim(),
        pong: true
    })),

    get("/links", async (_, res) => {
        const results = await db.find();

        send(res, 200, results);
    }),
    post("/links", async (req, res) => {
        let body = null;
        try {
            body = await json(req);
            if (!body.link) throw Error("I cant even");
        } catch (error) {
            console.error(error);
            return send(res, 422, { error: "nope" });
        }
        await db.insert({ _id: ulid(), link: body.link });
        const results = await db.find();

        return send(res, 200, results);
    }),

    del("/links/:id", async (req, res) => {
        const { id } = req.params;
        try {

            const row = await db.find({ _id: id });
            if (row) row.removeOne(0);

        } catch (error) {
            console.error(error);
            return send(res, 422, { error: "nope" });
        }
        return send(res, 200);
    }),

    get("/", r404),

    get("/*", r404),
    post("/*", r404),
));
