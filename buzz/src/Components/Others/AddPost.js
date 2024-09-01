import './AddPost.css';

function AddPost({ cancel, colors, setImage, setLocation, setCaption, handleSubmit, postLocation, postCaption }) {
    
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleCaptionChange = (event) => {
        setCaption(event.target.value);
    };

    return (
        <div className="add-post py-4 px-4 br" style={{ color: colors.Text, backgroundColor: colors.Highlight }}>
            <div className="add-post-content px-1 py-2">
                <div className='add-post-location pb-3 pt-2'>
                    <p className="pb-2 m-0 text-esm-red">Where are you?</p>
                    <input
                        type="text" 
                        placeholder="Add location" 
                        className='add-location-input br text-sm py-1 px-3'
                        value={postLocation || ''} 
                        onChange={handleLocationChange} 
                        style={{ color: colors.Text, backgroundColor: colors.Input }}
                    />
                </div>

                <hr />
                <div className="add-post-text pb-1">
                    <p className="pb-2 m-0 text-esm-red">Add a caption?</p>
                    <textarea
                        placeholder="Start typing..."
                        className="py-3 px-3 add-post-input text-sm"
                        style={{ color: colors.Text, backgroundColor: colors.Input }}
                        value={postCaption || ''} 
                        onChange={handleCaptionChange}
                    />
                </div>
                <hr />
                <div className="add-post-media py-2">
                    <p className="pb-2 m-0 text-esm-red">Add media</p>
                    <div className='d-flex gap justify-content-between align-items-center pt-3'>
                        <div>
                            <input 
                                style={{ color: colors.Text, backgroundColor: colors.Input }} 
                                type="file" 
                                className='br add-post-media-input text-sm' 
                                onChange={handleImageChange} 
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="post-div pt-2">
                    <div className='pt-2 d-flex justify-content-between'>
                        <button onClick={cancel} className='cancel-post-btn normal-btn px-3'>Cancel</button>
                        <button onClick={handleSubmit} className='normal-btn px-3'>Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddPost;
