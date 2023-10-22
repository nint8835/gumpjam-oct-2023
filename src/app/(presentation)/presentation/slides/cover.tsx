export default function CoverSlide() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <div className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-6xl font-bold text-transparent">
                Untitled Gumpjam Game
            </div>
            <div className="text-2xl italic text-muted-foreground">
                {'The world\'s leading "'}
                <span className="text-green-700">number go up</span>
                {'" simulator.'}
            </div>
        </div>
    );
}
