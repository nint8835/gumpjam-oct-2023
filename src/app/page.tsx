'use server';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import db from '@/db';
import { ssrGetCurrentUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { ResourceType, Resources } from '@/resources';
import { getCompanyValue } from '@/resources/utils';
import Link from 'next/link';

export default async function HomePage() {
    const allCompanies = await db.query.companies.findMany({
        with: {
            resources: true,
        },
    });
    const totalValue = allCompanies.reduce((total, company) => total + getCompanyValue(company), 0);

    const currentUser = await ssrGetCurrentUser();

    const ownedCompanies = allCompanies.filter((company) => company.ownerId === currentUser?.id);
    const ownedValue = ownedCompanies.reduce((total, company) => total + getCompanyValue(company), 0);

    const globalAverage = totalValue / allCompanies.length;
    const ownedAverage = ownedValue / ownedCompanies.length;

    const averageDifference = ownedAverage - globalAverage;

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Untitled Gumpjam Game</CardTitle>
                    <CardDescription>World's leading "number go up" simulator.</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Global Stats</h3>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-1 flex-col">
                                <div className="text-sm font-semibold text-muted-foreground">Total Companies</div>
                                <div className="text-xl font-semibold text-accent-foreground">
                                    {allCompanies.length.toLocaleString()}
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col">
                                <div className="text-sm font-semibold text-muted-foreground">Total Value</div>
                                <div className="text-xl font-semibold text-accent-foreground">
                                    {Resources[ResourceType.Money].valueString(totalValue)}
                                </div>
                            </div>
                            <div className="flex flex-1 flex-col">
                                <div className="text-sm font-semibold text-muted-foreground">Average Value</div>
                                <div className="text-xl font-semibold text-accent-foreground">
                                    {Resources[ResourceType.Money].valueString(totalValue / allCompanies.length)}
                                </div>
                            </div>
                        </div>

                        {currentUser !== null && (
                            <>
                                <h3 className="text-xl font-semibold">Your Stats</h3>
                                {ownedCompanies.length === 0 ? (
                                    <div className="flex w-full flex-row justify-center text-muted-foreground">
                                        You don't own any companies.
                                    </div>
                                ) : (
                                    <div className="flex flex-row gap-4">
                                        <div className="flex flex-1 flex-col">
                                            <div className="text-sm font-semibold text-muted-foreground">Companies</div>
                                            <div className="text-xl font-semibold text-accent-foreground">
                                                {ownedCompanies.length.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <div className="text-sm font-semibold text-muted-foreground">Value</div>
                                            <div className="whitespace-pre text-xl font-semibold text-accent-foreground">
                                                {Resources[ResourceType.Money].valueString(ownedValue)}{' '}
                                                <span className="text-sm text-muted-foreground">
                                                    ({((ownedValue / totalValue) * 100).toLocaleString()}% of the
                                                    economy)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <div className="text-sm font-semibold text-muted-foreground">
                                                Average Value
                                            </div>
                                            <div className="whitespace-pre text-xl font-semibold text-accent-foreground">
                                                {Resources[ResourceType.Money].valueString(
                                                    ownedValue / ownedCompanies.length,
                                                )}{' '}
                                                <span
                                                    className={cn(
                                                        'text-sm',
                                                        averageDifference >= 0 ? 'text-green-700' : 'text-red-700',
                                                    )}
                                                >
                                                    {Resources[ResourceType.Money].valueString(
                                                        Math.abs(averageDifference),
                                                    )}{' '}
                                                    {averageDifference > 0 ? 'above' : 'below'} average
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-row-reverse">
                    <div>
                        <span className="mr-4 italic">Ready to make number go up?</span>
                        {currentUser === null ? (
                            <Button asChild>
                                <a href="/auth">Sign in</a>
                            </Button>
                        ) : (
                            <Button asChild>
                                <Link href="/companies">View your companies</Link>
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
