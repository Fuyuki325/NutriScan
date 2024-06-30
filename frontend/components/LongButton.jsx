const LongButton = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className = "bg-darkblue text-white text-center text-xl py-2 lato rounded-lg hover:bg-darkblue-200 w-44" > {text} </button>
        
    )
}

export default LongButton;