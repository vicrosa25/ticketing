function FileHeader({ file, onDelete }) {
  return (
    <div>
      {file.name}
      <button onClick={() => onDelete(file)}>Delete</button>
    </div>
  );
}

export default FileHeader;
