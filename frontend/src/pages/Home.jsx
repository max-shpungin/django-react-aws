import { useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

import Note from "../components/Note";
import '../styles/Home.css'

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = async () => {
        try {
            const res = await api.get("/api/notes/");
            setNotes(res.data);
            console.log("Notes: ", res.data);
        } catch (error) {
            console.error("Error fetching notes: ", error);
            alert(error);
        }
    };

    const deleteNote = async (id) => {
        try {
            const res = await api.delete(`/api/notes/delete/${id}`);
            if (res.status === 204) {
                alert("Note was deleted");
                setNotes((prevNotes) =>
                    prevNotes.filter((note) => note.id !== id)
                );
            } else {
                alert("Failed to delete note");
            }
        } catch (error) {
            console.log("API ERROR: ", error);
        }
    };

    const createNote = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/notes/", { content, title });

            if (res.status === 201) {
                alert("Noted created!");
                getNotes();
            } else {
                alert("failed to make note");
            }
        } catch (error) {
            error;
        }
    };

    return (
        <div>
            <div>
                <h2>Notes</h2>
                {console.log("mapping notes, ", notes)}
                {notes.map((note) => (
                    <Note note={note} onDelete={deleteNote} key={note.id} />
                ))}
            </div>

            <h2>Create a note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title: </label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="content">Content: </label>
                <br />
                <textarea
                    name="content"
                    id="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default Home;
