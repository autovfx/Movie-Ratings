//AutoVFX 2024
//Exercise: Movie Rating System

class MovieRatingSystem {
    constructor(movies) {
        this.movies = movies.map(movie => {
            const originalRatings = movie.ratings.length;
            movie.ratings = movie.ratings.filter(this.isValidRating);
            if (movie.ratings.length < originalRatings) {
                this.logMessage(`Warning: Invalid ratings removed from '${movie.title}'.`, 'yellow');
            }
            return movie;
        });
    }

    findMovie(movieId) {
        return this.movies.find(movie => movie.id === movieId);
    }

    isValidRating(rating) {
        return rating >= 1 && rating <= 5;
    }

    addRating(movieId, rating) {
        const movie = this.findMovie(movieId);
        if (!movie) {
            this.logMessage(`Error: Movie with ID ${movieId} not found.`, 'red');
            return { error: `Movie with ID ${movieId} not found.` };
        }
        if (!this.isValidRating(rating)) {
            this.logMessage(`Error: Rating must be between 1 and 5.`, 'red');
            return { error: `Rating must be between 1 and 5.` };
        }
        movie.ratings.push(rating);
        const message = `Rating '${rating}' added to '${movie.title}'`;
        this.logMessage(message, 'green');
        return { success: message, movie };
    }

    getAverageRating(movieId) {
        const movie = this.findMovie(movieId);
        if (!movie) {
            const error = `Error: Movie with ID ${movieId} not found.`;
            this.logMessage(error, 'red');
            return { error };
        }
        if (movie.ratings.length === 0) {
            const error = `Error: No ratings available for '${movie.title}'.`;
            this.logMessage(error, 'red');
            return { error };
        }
        const average = movie.ratings.reduce((accumulator, rating) => accumulator + rating, 0) / movie.ratings.length;
        const roundedAverage = parseFloat(average.toFixed(1));
        const result = { title: movie.title, rating: roundedAverage, totalRatings: movie.ratings.length };
        this.logMessage(`Average rating for '${movie.title}' is ${this.colorText(roundedAverage, 'blue')} based on ${movie.ratings.length} ratings.`);
        return result;
    }
    
    

    getTopRatedMovie() {
        const ratedMovies = this.movies.filter(movie => movie.ratings.length > 0);
        if (ratedMovies.length === 0) {
            const error = 'No movies have ratings yet.';
            this.logMessage(error, 'red');
            return { error };
        }
        const topMovie = ratedMovies.reduce((topMovie, currentMovie) => {
            const topAverageRating = topMovie.ratings.reduce((accumulator, rating) => accumulator + rating, 0) / topMovie.ratings.length;
            const currentAverageRating = currentMovie.ratings.reduce((accumulator, rating) => accumulator + rating, 0) / currentMovie.ratings.length;
            return currentAverageRating > topAverageRating ? currentMovie : topMovie;
        });
    
        const averageRating = parseFloat(
            (topMovie.ratings.reduce((accumulator, rating) => accumulator + rating, 0) / topMovie.ratings.length).toFixed(1)
        );
    
        const message = `Top rated movie is '${topMovie.title}' with an average rating of ${this.colorText(averageRating, 'green')} based on ${topMovie.ratings.length} ratings.`;
        this.logMessage(message);
    
        return { title: topMovie.title, averageRating: averageRating, totalRatings: topMovie.ratings.length };
    }
    
    

    getAllRatings(movieId) {
        const movie = this.findMovie(movieId);
        if (!movie) {
            const error = `Error: Movie with ID ${movieId} not found.`;
            this.logMessage(error, 'red');
            return { error };
        }
        const ratings = movie.ratings.length > 0 ? movie.ratings.join(', ') : 'None';
        const message = `Ratings for '${movie.title}': ${ratings}`;
        this.logMessage(message);
        return { title: movie.title, ratings: movie.ratings.length > 0 ? movie.ratings : "None" };
    }

    getMovieList() {
        return this.movies
            .map(movie => {
                const displayedRatings = movie.ratings.slice(0, 10).join(', ');
                const moreRatings = movie.ratings.length > 10 ? `... (and ${movie.ratings.length - 10} more)` : '';
                return `${movie.id}: ${this.colorText(movie.title, 'cyan')} (Ratings: ${this.colorText(displayedRatings + moreRatings || 'No ratings', 'yellow')})`;
            })
            .join('\n');
    }
    

    logMessage(message, color = 'reset') {
        console.log(this.colorText(message, color));
    }

    colorText(text, color) {
        const colors = {
            reset: "\x1b[0m",
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            cyan: "\x1b[36m"
        };
        return `${colors[color]}${text}${colors.reset}`;
    }
}

const moviesList = [
    { id: 0, title: "Inception", ratings: [5, 4, 5] },
    { id: 1, title: "The Matrix", ratings: [4, 4, 4] },
    { id: 2, title: "Interstellar", ratings: [] },
    { id: 3, title: "Bigfoot", ratings: [5, 6 ,7] }, //Sneaky. This is handled on init
    { id: 4, title: "Rotten", ratings: [] }
];

const movieSystem = new MovieRatingSystem(moviesList);


//I was not sure if this was supposed to be a functional App but if not you can stop reading here. If so please feel free. 
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function handleMenu(option) {
    let result;
    switch (option) {
        case '1':
            rl.question('Enter Movie ID and Rating (e.g., 1 5): ', (answer) => {
                const [movieId, rating] = answer.split(' ').map(Number);
                result = movieSystem.addRating(movieId, rating);
                displayResult(result);
                showMenu();
            });
            break;
        case '2':
            rl.question('Enter Movie ID: ', (movieId) => {
                result = movieSystem.getAverageRating(Number(movieId));
                displayResult(result);
                showMenu();
            });
            break;
        case '3':
            result = movieSystem.getTopRatedMovie();
            displayResult(result);
            showMenu();
            break;
        case '4':
            rl.question('Enter Movie ID: ', (movieId) => {
                result = movieSystem.getAllRatings(Number(movieId));
                displayResult(result);
                showMenu();
            });
            break;
        case '5':
            rl.close();
            break;
        default:
            movieSystem.logMessage('Invalid option, please choose again.', 'red');
            showMenu();
            break;
    }
}


//I was not sure whether or not the objective was a cleanly CLI interface or whether there were trick questions involving signiature like returning an object instead of logging something to the CLI, 
//(From a technical standpoint you would likeley want an object for further use but from a UIX standpoint you would likely not need an object in a case like this.)
//So this is a secondary output which shows object return and type from a back end perspective to compliment the UI perspective which is just text out the CLI.

function displayResult(result) {
    console.log('\n--- Returned ---');
    console.log('Type:', typeof result);
    console.log('Content:', result);
    console.log('----------------------\n');
}

function showMenu() {
    console.log(`
Current Movies:
${movieSystem.getMovieList()}

Choose an option:
1. Add Rating
2. Get Average Rating
3. Get Top Rated Movie
4. Get All Ratings
5. Exit
`);
    rl.prompt();
}

rl.on('line', handleMenu);

rl.on('close', () => {
    console.log('Exiting movie rating system.');
    process.exit(0);
});

showMenu();


//TESTS
//These tests contain in and out of bounds calls and should run aground the constraints you outlined in your Problem Statement. 
// movieSystem.addRating(1, 5); 
// movieSystem.addRating(10, 4); 
// movieSystem.addRating(1, 6);  
// movieSystem.getAverageRating(0); 
// movieSystem.getAverageRating(2); 
// movieSystem.getAverageRating(10); 
// movieSystem.getTopRatedMovie(); 
// movieSystem.getAllRatings(0); 
// movieSystem.getAllRatings(2); 
// movieSystem.getAllRatings(10); 




// //Scalability Test. Uncomment me if you want to do 100 thousand operations to validate the main functionality of the application. This contains no out of bounds calls but covers the entire scope in all permutations. You can modify the randomRating and randomMovieId to see failures and counts. 

// const errorLog = [];
// let addRatingSuccessCount = 0;
// let getAverageRatingSuccessCount = 0;
// let getAllRatingsSuccessCount = 0;
// let getTopRatedMovieSuccessCount = 0;

// for (let i = 0; i < 25000; i++) {
//     const randomRating = Math.floor(Math.random() * 5) + 1;
//     const randomMovieId = Math.floor(Math.random() * 5);

//     const addResult = movieSystem.addRating(randomMovieId, randomRating);
//     if (addResult && addResult.error) {
//         console.error(`Error encountered during addRating: ${addResult.error}`);
//         errorLog.push(`addRating: ${addResult.error}`);
//     } else {
//         addRatingSuccessCount++;
//     }

//     const avgResult = movieSystem.getAverageRating(randomMovieId);
//     if (avgResult && avgResult.error) {
//         console.error(`Error encountered during getAverageRating: ${avgResult.error}`);
//         errorLog.push(`getAverageRating: ${avgResult.error}`);
//     } else {
//         getAverageRatingSuccessCount++;
//     }

//     const allRatingsResult = movieSystem.getAllRatings(randomMovieId);
//     if (allRatingsResult && allRatingsResult.error) {
//         console.error(`Error encountered during getAllRatings: ${allRatingsResult.error}`);
//         errorLog.push(`getAllRatings: ${allRatingsResult.error}`);
//     } else {
//         getAllRatingsSuccessCount++;
//     }

//     const topRatedResult = movieSystem.getTopRatedMovie();
//     if (topRatedResult && topRatedResult.error) {
//         console.error(`Error encountered during getTopRatedMovie: ${topRatedResult.error}`);
//         errorLog.push(`getTopRatedMovie: ${topRatedResult.error}`);
//     } else {
//         getTopRatedMovieSuccessCount++;
//     }
// }

// if (errorLog.length > 0) {
//     console.log(`Encountered ${errorLog.length} errors during execution.`);
//     console.log('Errors:', errorLog);
// } else {
//     console.log('Execution completed without errors.');
// }

// console.log(`\nSuccess Counts:`);
// console.log(`addRating: ${addRatingSuccessCount}`);
// console.log(`getAverageRating: ${getAverageRatingSuccessCount}`);
// console.log(`getAllRatings: ${getAllRatingsSuccessCount}`);
// console.log(`getTopRatedMovie: ${getTopRatedMovieSuccessCount}`);
// showMenu();