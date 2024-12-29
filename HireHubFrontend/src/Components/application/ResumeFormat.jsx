function ResumeFormat({imageUrl,onClose}){
    return (
        <>
        <div className="resume-model">
           <div className="model-context">
            <span className="close" onClick={onClose}>&times;</span>
            <img src={imageUrl} alt="resume" />
           </div>
        </div>
        </>
    )
}
export default ResumeFormat;