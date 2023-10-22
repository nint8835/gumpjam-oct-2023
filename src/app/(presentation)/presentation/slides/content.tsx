import { cn } from '@/lib/utils';
import { ResourceCategory, Resources } from '@/resources';

function ContentCard({ category, className }: { category: ResourceCategory; className?: string }) {
    return (
        <div className={cn('flex-1 rounded-lg p-6', className)}>
            <div className="text-4xl font-bold">
                {Object.values(Resources)
                    .filter(({ category: resourceCategory }) => resourceCategory === category)
                    .length.toLocaleString()}
            </div>
            <div>{category}</div>
        </div>
    );
}

const categoryClasses = {
    [ResourceCategory.Core]: 'bg-gradient-to-br from-yellow-500 to-yellow-800',
    [ResourceCategory.NaturalResources]: 'bg-gradient-to-br from-green-500 to-green-800',
    [ResourceCategory.Machinery]: 'bg-gradient-to-br from-blue-500 to-blue-800',
    [ResourceCategory.RefinedResources]: 'bg-gradient-to-br from-purple-500 to-purple-800',
    [ResourceCategory.SupplyContracts]: 'bg-gradient-to-br from-red-500 to-red-800',
};

export default function ContentSlide() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-16">
            <div className="text-4xl font-semibold">Content</div>
            <div className="w-full">
                <div className="mt-2 flex w-full flex-row gap-4">
                    {Object.values(ResourceCategory).map((category) => (
                        <ContentCard key={category} category={category} className={categoryClasses[category]} />
                    ))}
                </div>
            </div>
        </div>
    );
}
