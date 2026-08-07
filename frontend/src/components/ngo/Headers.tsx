interface HeaderProps{
    readonly title: string;
}
function Header({title}: HeaderProps) {
    return (
        <header className="flex justify-between items-center mb-5">
            <h1 className="text-3xl font-headline font-bold text-primary">{title}</h1>
        </header>
    );
}
export default Header