export default function GameplaySlide() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-16">
            <div className="text-4xl font-semibold">Gameplay</div>
            <div className="text-xl">
                <ul className="list-disc">
                    <li>You found one or more companies.</li>
                    <li>
                        In each company, you can:
                        <ul className="ml-8 list-disc">
                            <li>Manually harvest raw resources.</li>
                            <li>Sell resources.</li>
                            <li>Purchase machines to refine resources.</li>
                            <li>Refine resources.</li>
                            <li>Craft further refined resources.</li>
                            <li>
                                Purchase {'"supply contracts"'}
                                <ul className="ml-8 list-disc">
                                    <li>These allow replacing resources in crafting recipes with money.</li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
}
