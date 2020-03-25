import React, {useCallback,useState,useEffect} from 'react'
import {useDropzone} from 'react-dropzone'

const Dropzone = p => {
  const {onDragged} = p;
  const [data,setData] = useState([]);
  const [allFilesLoaded, setAllFilesLoaded] = useState(false);
  const [filesLength,setFilesLength] = useState(null);

  useEffect(() => {
    if (filesLength === data.length) setAllFilesLoaded(true);
    if (allFilesLoaded) onDragged(data);
  }, [data, allFilesLoaded])

  const onDrop = useCallback((acceptedFiles) => {
    // reset state each time data is dragged
    setData([]);
    setFilesLength(null);
    setAllFilesLoaded(false);

    setFilesLength(acceptedFiles.length);

    //parse dragged jsons
    acceptedFiles.forEach((file,i) => {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = ((theFile) => {
        return (e) => {
          const JsonObj = JSON.parse(e.target.result).timelineObjects;
          setData(data => [...data, JsonObj]);
        };
      })(file);
      reader.readAsText(file)
    })
  }, [data])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )
}

export default Dropzone;