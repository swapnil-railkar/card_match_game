export default function Overlay({title, children, buttonText, ...props}) {
    return(
        <main className="overlay">
            <h1 className="app-theme text">{title}</h1>
            {children}
            <button className="text" {...props}>{buttonText}</button>
        </main>
    )
}