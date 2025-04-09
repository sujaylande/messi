const autocannon = require("autocannon");

const routes = [
    "http://localhost:5001/api/student/display-notices",
    "http://localhost:5001/api/student/display-menu",
];

// const routes = [
//     "http://localhost:5000/api/manager/mess-stat",
//     "http://localhost:5000/api/manager/student-stat/:reg_no",
//     "http://localhost:5000/api/manager/active-student",
//     "http://localhost:5000/api/manager/todays-attendance",
//     "http://localhost:5000/api/manager/student-status",
//     "http://localhost:5000/api/manager/students-status-list",
//     "http://localhost:5000/api/manager/remove-student/:reg_no",
//     "http://localhost:5000/api/manager/add-notice",
//     "http://localhost:5000/api/manager/display-notices",
//     "http://localhost:5000/api/manager/remove-notice/:id",
//     "http://localhost:5000/api/manager/add-menu",
//     "http://localhost:5000/api/manager/display-menu",
//     "http://localhost:5000/api/manager/feedback-form",
//     "http://localhost:5000/api/manager/feedback-stats"
// ];



const duration = 30;

async function runLoadTest(url) {
    return new Promise((resolve, reject) => {
        autocannon({
            url,
            duration
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                // Extract only required metrics
                const summary = {
                    route: url,
                    requests: result.requests.total,
                    data_read: result.throughput.total,
                    avg_latency: result.latency.average,
                    avg_requests_per_sec: result.requests.average,
                    avg_bytes_per_sec: result.throughput.average
                };
                resolve(summary);
            }
        });
    });
}

(async () => {
    const results = await Promise.all(routes.map(runLoadTest));
    console.log(JSON.stringify(results, null, 4)); // Pretty-print results
})();
