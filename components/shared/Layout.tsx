import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";

type LayoutProps = {
    children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="h-screen flex flex-col">
            <Header />

            <div className="flex flex-1">
                <Sidebar />

                <MainContent>
                    {children}
                </MainContent>
            </div>
        </div>
    );
};