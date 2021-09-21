const Exam = require('..//app/model/exam')
const Unit = require('..//app/model/unit')
const Vocabulary = require('..//app/model/vocabulary')


function Routes(app) {
    app.get('/', function(req, res) {
        Unit.find().then((units) => {
            res.render('home.ejs', { units: units })
        })

    })
    app.get('/exam/:slug', function(req, res) {
        let slug = req.params.slug
        Unit.findOne({ slug: slug }).then((unit) => {
            if (unit) {
                res.render('exam.ejs', { unit })
            } else {
                res.redirect('/')
            }
        })

    })
}
module.exports = Routes;