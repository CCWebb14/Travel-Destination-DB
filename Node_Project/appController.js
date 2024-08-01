const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.post('/get-attractions', async (req, res) => {
    const { province, city } = req.body;
    console.log(province, city)
    const tableContent = await appService.getAttractions(province, city);
    res.json({ data: tableContent });
});

router.post('/add-attraction', async (req, res) => {
    const { name, description, open, close, lat, long, category, province, city } = req.body;
    const tableContent = await appService.addAttraction(name, description, open, close, lat, long, category, province, city);
    res.json({ data: tableContent });
})

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.post("/project-tables", async (req, res) => {
    const {id, toSelect} = req.body;
    const projectedExperiences = await appService.projectExperienceAttribute(id, toSelect);

    if (projectedExperiences) {
        res.json({projectedExperiences});
    }
})

module.exports = router;