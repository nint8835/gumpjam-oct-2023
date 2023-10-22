import db from '@/db';
import { Tree } from './tree';

export default async function TreePage({ params }: { params: { id: number } }) {
    const company = await db.query.companies.findFirst({
        where: (company, { eq }) => eq(company.id, params.id),
        with: {
            resources: true,
        },
    });

    if (!company) {
        return <div>Company not found.</div>;
    }

    return <Tree resources={company.resources} />;
}
