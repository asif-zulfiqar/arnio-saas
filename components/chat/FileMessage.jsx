
const FileMessage = ({fileName}) => {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-blue-500 text-white rounded-lg px-3 py-2 flex items-center">
        <span className="mr-2">□</span>
        {fileName}
      </div>
    </div>
  )
}

export default FileMessage