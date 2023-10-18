import db from '@/db';

async function run() {
    const companies = await db.query.companies.findMany({});
    console.log(companies);
}

run();
