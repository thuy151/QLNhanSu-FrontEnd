import React, { useState, useEffect, useCallback } from "react";
// React Dropzone
import { useDropzone } from "react-dropzone";
import { openDefaultEditor } from "./pintura";
// Pintura Image Editor
import "./pintura.css";
import CommonButton from "../Common/Button";
import {EditOutlined} from "@ant-design/icons";

function ReactDropzonePintura (props:any) {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles:any) => {
        setFiles(
            acceptedFiles.map((file:any) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            )
        );
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 1,
        onDrop: onDrop
    });

    const editImage = (image:any, done:any) => {
        const imageFile = image.pintura ? image.pintura.file : image;
        const imageState = image.pintura ? image.pintura.data : {};

        const editor:any = openDefaultEditor({
            src: imageFile,
            imageState
        });

        editor.on("close", () => {
            // the user cancelled editing the image
        });

        editor.on("process", ({ dest, imageState }:any) => {
            Object.assign(dest, {
                pintura: { file: imageFile, data: imageState }
            });
            done(dest);
        });
    };

    const thumbs = files.map((file:any, index:number) => (
        <div className="react-dropzone-thumb" key={index}>
            <img className="react-dropzone-thumb-img" src={file.preview} alt="" />
            <div
                className="react-dropzone-thumb-btn"
                onClick={() =>
                    editImage(file, (output:any) => {
                        const updatedFiles:any = [...files];

                        // replace original image with new image
                        updatedFiles[index] = output;

                        // revoke preview URL for old image
                        if (file.preview) URL.revokeObjectURL(file.preview);

                        // set new preview URL
                        Object.assign(output, {
                            preview: URL.createObjectURL(output)
                        });

                        // update view
                        setFiles(updatedFiles);
                    })
                }
            >
                <EditOutlined />
            </div>
        </div>
    ));

    useEffect(
        () => () => {
            // Make sure to revoke the Object URL to avoid memory leaks
            files.forEach((file:any) => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return (
        <section className="react-dropzone">
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <CommonButton size={'small'}>Upload</CommonButton>
            </div>
            <aside>{thumbs}</aside>
        </section>
    );
}

export default ReactDropzonePintura;
