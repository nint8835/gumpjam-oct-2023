'use client';
import { resources as resourcesTable } from '@/db/schema';
import { Resources } from '@/resources';
import { CraftingData } from '@/resources/craft_data';
import { useLayoutEffect, useRef, useState } from 'react';
import ForceGraph, { ForceGraphMethods } from 'react-force-graph-2d';

export function Tree({ resources }: { resources: (typeof resourcesTable.$inferSelect)[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const graphRef = useRef<ForceGraphMethods>();
    const [graphHeight, setGraphHeight] = useState(0);

    useLayoutEffect(() => {
        if (ref.current === null) {
            return;
        }
        const { height } = ref.current.getBoundingClientRect();
        setGraphHeight(height);
    }, []);

    const nodes = [];
    const links = [];

    for (const resource of Object.values(Resources)) {
        const node = {
            type: resource.type,
            name: resource.name,
            category: resource.category,
        };
        nodes.push(node);
    }

    for (const resource of Object.values(Resources)) {
        if (!resource.crafting) {
            continue;
        }

        const data = new CraftingData(resources, resource.type);

        const yields = data.yield(1);
        const ingredients = data.requiredIngredients(1);

        for (const [ingredientType] of ingredients) {
            for (const [yieldType, yieldAmount] of yields) {
                // Ignore if the recipe produces the same amount of an item as it requires (such as by being a rate-limiting equipment used for a craft)
                if (ingredients.find(([ingredient]) => ingredient === yieldType)?.[1] === yieldAmount) {
                    continue;
                }

                links.push({
                    source: ingredientType,
                    target: yieldType,
                    targetNode: nodes.find((node) => node.type === yieldType),
                });
            }
        }
    }

    return (
        <div className="h-full" ref={ref}>
            <ForceGraph
                nodeId="type"
                // This code hurts me
                nodeLabel={({ category, name }) =>
                    `<div class="flex flex-col items-center">
                        <div>
                            ${name}
                        </div>
                        <div class="text-muted-foreground">
                            (${category})
                        </div>
                    </div>`
                }
                nodeAutoColorBy="category"
                graphData={{ nodes, links }}
                linkColor={() => 'rgba(255,255,255,0.2)'}
                height={graphHeight}
                enableNodeDrag={false}
                cooldownTicks={100}
                onEngineStop={() => graphRef.current!.zoomToFit(400, 200)}
                linkDirectionalArrowRelPos={1}
                linkDirectionalArrowLength={3.5}
                ref={graphRef}
            />
        </div>
    );
}
