const Vocabulary = require('..//app/model/vocabulary');
const Unit = require('..//app/model/unit');
const Exam = require('..//app/model/exam');
class ExamControl {
    constructor(userName, unitSslug) {
        this.unitSlug = unitSslug;
        this.userName = userName;
    }
    async init() {

        let unit = await Unit.findOne({ slug: this.unitSlug })
        let vocabularies = await Vocabulary.find({ unitId: unit.id })

        this.incorrectVocabularies = [];
        this.indexQuestion = 0;
        this.unitID = unit.id
        this.vocabularies = vocabularies.sort((a, b) => Math.random() - 0.5);
    }
    length() {
        return this.vocabularies.length;
    }
    async getQuestion() {
        // 1 answer correct
        let option = [this.vocabularies[this.indexQuestion].vietnamese]
            // get 3 answer all unit
        let optionOrder = await Vocabulary.aggregate([{
            $match: {
                "vietnamese": { $ne: option[0] }
            },
        }, {
            $sample: { size: 3 }
        }])
        optionOrder.forEach(element => {
            option.push(element.vietnamese)
        });
        option.sort(() => Math.random() - 0.5)
        return {
            index: this.indexQuestion,
            english: this.vocabularies[this.indexQuestion].english,
            type: this.vocabularies[this.indexQuestion].type,
            option: option,
        }
    }
    isFinished() {
        if (this.indexQuestion >= this.length()) {
            this.save()
            return true;
        }
        return false;
    }
    isAnswer(answer) {
        if (this.isFinished()) {
            throw 'Exam finished'
        }
        if (answer.trim() == this.vocabularies[this.indexQuestion].vietnamese.trim()) {
            this.indexQuestion++;
            return true
        }
        // incorrect // check not replate
        if (this.incorrectVocabularies[this.incorrectVocabularies.length - 1] != this.vocabularies[this.indexQuestion]) {
            this.incorrectVocabularies.push(this.vocabularies[this.indexQuestion]);
        }
        return false
    }
    getIncorrectVocabularies() {
        return this.incorrectVocabularies
    }
    save() {
        // save
        Exam.findOne({ userName: this.userName, unitId: this.unitID }).then((exam) => {
            var percentComplete = parseInt((this.length() - this.getIncorrectVocabularies().length) * (100 / this.length()))
            if (exam) {
                Exam.updateOne({ userName: this.userName, unitId: this.unitID }, { percentComplete: percentComplete }).then(() => { console.log('update ok') })
            } else {
                new Exam({
                    userName: this.userName,
                    percentComplete: percentComplete,
                    unitId: this.unitID
                }).save()
            }
        })
    }
}
module.exports = ExamControl