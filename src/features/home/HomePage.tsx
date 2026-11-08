import SidebarToggle from './components/SidebarToggle';
import ThemeStatus from './components/ThemeStatus';
import WelcomeMessage from './components/WelcomeMessage';

const HomePage = () => (
    <div className="flex min-h-svh p-6">
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
            <ThemeStatus />
            <SidebarToggle />
            <WelcomeMessage />
        </div>
    </div>
);

export default HomePage;
