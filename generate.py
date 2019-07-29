import numpy as np
from music21 import *
from tensorflow.keras import optimizers
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation, Flatten, Dropout, Input, LSTM, BatchNormalization, Conv1D, TimeDistributed

def list_instruments(midi_stream):
    '''
    Seperates midi by track and displays instrument of each track
    Work in progress
    '''
    stream_part = midi_stream.parts.stream()
    print("List of instruments found on MIDI file:")
    for track in stream_part:
        #abc=track
        print (track.stream_part)

def extract_notes(midi_stream):
    '''
    Populates an array with 3 tuples, first the pitch value
    Second: duration
    Third: offset(when it is played relative to track)
    Chords are split into individual notes, later to be reconstructed after model
    '''
    lists  = []
    offset=0

    for note_i in midi_stream.flat:
        if isinstance(note_i, note.Note):
            lists.append([max(0., note_i.pitch.ps),round(note_i.quarterLength,4),note_i.offset-offset])
            offset = note_i.offset
        elif isinstance(note_i, chord.Chord):
            for pitch in note_i.pitches:
                lists.append([max(0., pitch.ps),round(note_i.quarterLength,4),note_i.offset-offset])
            offset = note_i.offset
   
    return lists

import os

path = os.getcwd()

midi_files = []
# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        if 'input.mid' in file:
            midi_files.append(os.path.join(r, file))

for g in midi_files:
    print(g)


notes = np.asarray(extract_notes(converter.parse(midi_files[0])))
for element in midi_files[1:]:
    midistream = converter.parse(element)
    notes = np.append(notes,extract_notes(midistream),0)




converter.parse(midi_files[0]).show('text')




sequence_length = 100
train_length = len(notes)-sequence_length

notecount = 128
durationcount= 60
offsetcount = 60

features = notecount + durationcount + offsetcount

X= np.zeros((train_length,sequence_length,features))
Y= np.zeros((train_length,features))



    
for i in range(0, train_length):
    input_sequence = notes[i: i+sequence_length]
    output_note = notes[i+sequence_length]
    for j in range(0,100): 
        note_temp = int(round(input_sequence[j][0]))
        duration_temp = min(int(round(input_sequence[j][1]*12)),59)
        offset_temp = int(min(round(input_sequence[j][2]*12),59))
        X[i][j][note_temp] = 1
        X[i][j][duration_temp+notecount] = 1
        X[i][j][offset_temp+durationcount+notecount] = 1
    
    note_temp = int(round(output_note[0]))
    duration_temp = int(min(round(output_note[1]*12),59))
    offset_temp = int(min(round(output_note[2]*12),59))
    Y[i][note_temp] = 1
    Y[i][duration_temp+notecount] = 1
    Y[i][offset_temp+durationcount+notecount] = 1




Xnotes = X[:, :, 0:128]
Xduration = X[:, :, 128:188]
Xoffset =X[:, :, 188:248]

Ynotes = Y[:, 0:128]
Yduration = Y[:, 128:188]
Yoffset =Y[:, 188:248]

node_number=128
epochCount=400

# Load models if you have trained models.
from keras.models import load_model

model_notes = load_model('my_model_notes.h5')
model_duration = load_model('my_model_duration.h5')
model_offset = load_model('my_model_offset.h5')


def predictOutputs(X, features, model):
    n = np.random.randint(0, len(X)-1)
    sequence = X[n]
    start_sequence = sequence.reshape(1, sequence_length, features)
    outputs = np.zeros((100))

    for i in range(0, 100):
        model_output = int(model.predict_classes(start_sequence, verbose=0))
        sequence = start_sequence[0][1:]
        one_hot_model_output = np.zeros((1,features))
        one_hot_model_output[0, model_output] = 1
        start_sequence = np.concatenate((sequence, one_hot_model_output))
        start_sequence = start_sequence.reshape(1, sequence_length, features)
        outputs[i] = model_output
    
    return outputs

output_notes = predictOutputs(Xnotes, Xnotes.shape[2], model_notes)
output_duration = predictOutputs(Xduration, Xduration.shape[2], model_duration)
output_offset = predictOutputs(Xoffset, Xoffset.shape[2], model_offset)


sum_offset = 0
end_notes = []
for i in range(0,100):
    new_note = note.Note(output_notes[i])
    new_note.quarterLength = output_duration[i]/12
    new_note.offset = (output_offset[i]/12)+sum_offset
    print(type(new_note),new_note.pitch,new_note.quarterLength,new_note.offset)
    end_notes.append(new_note)
    sum_offset += output_offset[i]/12


from random import randrange

midi_stream = stream.Stream(end_notes)
midi_stream.insert(instrument.Piano())
print(midi_stream.write('midi', fp=os.getcwd()+str(randrange(10000))+'.mid'))
extract_notes(midi_stream)






