import Database from "@replit/database"
import express from "express"
import cors from "cors"

import authorized from "./authorized.js"
import submitProjectSchema from "./schemas/submitProject.js"

import process from "process"
import * as path from "path"

const app = express()
const db = new Database()

const requireAuth = authorized(["phamn23"])

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({ origin: "*" }))

app.get("/", (req, res) => {
    res.sendFile("index.html", {
        root: path.join(process.cwd(), "templates")
    })
})

// method to delete projects (only if you're me)
app.delete("/delete/:projectName", requireAuth, (req, res) => {
    const projectName = req.params.projectName
    db.delete(projectName)
    return res.json({
        success: true
    })
})

app.put("/clear/:projectName", requireAuth, async (req, res) => {
    const projectName = req.params.projectName
    const project = await db.get(projectName)

    if (project) {
        project.cleared = true
        db.set(projectName, project)

        return res.json({
            success: true
        })
    }

    return res.json({
        errors: ["Project not found."]
    })
})


// return all projects
app.get("/projects", async (req, res) => {
    const projectKeys = (await db.list()) || []
    const projects = await Promise.all(
        projectKeys.map(key => db.get(key))
    )

    // re-add the name back
    res.json(projects.map((project, i) => ({
        ...project,
        name: projectKeys[i],
    })))
})

// submit a project
app.post("/submitProject", async (req, res) => {
    const data = { ...req.body }

    if (!data) {
        return res.json({ errors: ["Missing payload"] })
    }

    const errors = submitProjectSchema.validate(data, true)
    if (errors.length > 0) {
        return res.json({ errors })
    }

    console.log(req.body, data.name)

    const existing = await db.get(data.name)
    if (existing) {
        console.log(existing)
        return res.json({ errors: ["Project name already exists"] })
    }

    db.set(data.name, {
        link: data.link,
        description: data.description,
        cleared: false
    })

    return res.json({
        success: true
    })
})

app.listen(5500)