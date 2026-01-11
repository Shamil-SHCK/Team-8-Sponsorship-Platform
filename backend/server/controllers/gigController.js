import Gig from '../models/Gig.js';

// 1. Backlog: Publish gig work & Gig work posting form
export const createGig = async (req, res) => {
    try {
        const { title, description, budget, category } = req.body;
        const newGig = new Gig({
            title, description, budget, category,
            company: req.user.id // Assumes auth middleware sets req.user
        });
        await newGig.save();
        res.status(201).json(newGig);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Backlog: View available gig works & Filter by category/budget
export const getAllGigs = async (req, res) => {
    try {
        const { category, minBudget } = req.query;
        let query = { status: 'open' }; // Only show open gigs to clubs

        if (category) query.category = category;
        if (minBudget) query.budget = { $gte: minBudget };

        const gigs = await Gig.find(query).populate('company', 'companyName');
        res.json(gigs);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. Backlog: Accept gig work
export const acceptGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) return res.status(404).json({ msg: 'Gig not found' });
        if (gig.status !== 'open') return res.status(400).json({ msg: 'Gig already taken' });

        gig.assignedClub = req.user.id;
        gig.status = 'accepted';
        await gig.save();

        res.json(gig);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
