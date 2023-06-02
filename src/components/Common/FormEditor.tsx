import { Editor } from "@tinymce/tinymce-react";

const SIZE_LIMIT = 5000;

const CommonFormEditor = ({ disabled, value = "", onChange, placeholder }: any) => {
    const handleUpdate = (editorValue: string, editor: any) => {
        const length = editor.getContent({ format: 'text' }).length;
        if (length <= SIZE_LIMIT) {
            onChange?.(editorValue);
        } else {
            onChange?.(editor.getContent({ format: 'text' }).slice(0, SIZE_LIMIT))
        }
    };
    const handleBeforeAddUndo = (evt: any, editor: any) => {
        const length = editor.getContent({ format: 'text' }).length;
        // note that this is the opposite test as in handleUpdate
        // because we are determining when to deny adding an undo level
        if (length > SIZE_LIMIT) {
            evt.preventDefault();
        }
    };

    return (
        <div className="avic-form-editor">
            <Editor 
                tinymceScriptSrc='/tinymce/js/tinymce/tinymce.min.js'
                init={{
                    entity_encoding: 'raw',
                    placeholder: placeholder || "",
                    height: 270,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'charmap',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'link image | forecolor backcolor emoticons',
                    language: 'vi'
                    // content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                disabled={disabled}
                onBeforeAddUndo={handleBeforeAddUndo}
                onEditorChange={handleUpdate}
                value={value}
            />
        </div>
    )
}

export default CommonFormEditor;