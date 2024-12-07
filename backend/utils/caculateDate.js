const calculateDaysFrom = (mongoDate) => {

    const givenDate = new Date(mongoDate);

    const currentDate = new Date();

    const timeDifference = currentDate - givenDate;

    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return dayDifference;
}

exports.calculateDaysFrom = calculateDaysFrom;