module.exports = {
  User: class User {
    constructor() {}

    setUserdetails(name, email) {
      this.name = name;
      this.email = email;
      this.questions = [];
      this.userAnswers = {};
    }

    getUserDetails() {
      return { name: this.name, email: this.email };
    }

    addQuestion(question) {
      this.questions.push(question);
    }

    getQuestions() {
      return this.questions;
    }

    checkAnswers(answers) {
      let crt = 0,
        wrg = 0;
      Object.keys(answers).forEach((key) => {
        if (answers[key] == this.questions[key].correctAnswer) {
          crt++;
        } else {
          wrg++;
        }
      });

      return { correct: crt, incorrect: wrg };
    }
  },
};
