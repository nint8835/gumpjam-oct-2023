'use client';
import { Resources } from '@/resources';
import { useLayoutEffect, useRef, useState } from 'react';
import ForceGraph from 'react-force-graph-2d';

export function Tree() {
    const ref = useRef<HTMLDivElement>(null);
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

    for (const [type, resource] of Object.entries(Resources)) {
        const node = {
            type: type,
            name: resource.name,
            category: resource.category,
        };
        nodes.push(node);

        if (resource.crafting) {
            for (const [ingredient] of Object.entries(resource.crafting.ingredients)) {
                links.push({
                    source: ingredient,
                    target: type,
                    targetNode: node,
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
                dagMode={'td'}
                dagLevelDistance={50}
                height={graphHeight}
            />
        </div>
    );
}
