interface HeaderProps{
    readonly title: string;
}
function Header({title}: HeaderProps) {
    return (
        <header className="flex justify-between items-center mb-5">
            <h1 className="text-3xl text-black">{title}</h1>
        </header>
    );
}
export default Header