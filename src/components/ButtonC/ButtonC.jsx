import "./ButtonC.css"

export const ButtonC = ({title, onClick, className}) => {

    return(
        <div className={className} onClick={onClick}>{title}</div>
    )
}