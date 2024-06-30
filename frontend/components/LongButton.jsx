const LongButton = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className = "bg-darkblue text-white text-center text-xl px-12 py-2 lato rounded-lg hover:bg-darkblue-200" > {text} </button>
        
    )
}

export default LongButton;