import { Test, TestingModule } from '@nestjs/testing';
import { INotesMapping } from '../../../../src/controllers/notes/inotes-mapping';
import { NotesMapping } from '../../../../src/controllers/notes/notes-mapping';
import { NOTES_CONTROLLER_TOKENS } from '../../../../src/controllers/notes/token/notes.token';
import { noteAuthorListFactory, noteDetailFactory, noteInsertedFactory, noteUpdatedFactory } from '../../../bots/controllers/notes-model.factory';


describe('NotesMapping', () => {
  let mapping: INotesMapping;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: NOTES_CONTROLLER_TOKENS.MAPPING, useClass: NotesMapping }],
    }).compile();

    mapping = module.get<INotesMapping>(NOTES_CONTROLLER_TOKENS.MAPPING);
  });

  it('map to NoteInsertedResponse', () => {
    expect(mapping).toBeDefined();
    const dto = noteInsertedFactory.build()
    const actual = mapping.toNoteInsertedResponse(dto)
    expect(actual).toEqual(dto)
  })

  it('map to NoteUpdatedResponse', () => {
    expect(mapping).toBeDefined();
    const dto = noteUpdatedFactory.build()
    const actual = mapping.toNoteInsertedResponse(dto)
    expect(actual).toEqual(dto)
  })

  it('map to NoteDetailResponse', () => {
    expect(mapping).toBeDefined();
    const dto = noteDetailFactory.build()
    const actual = mapping.toNoteDetailResponse(dto)
    expect(actual).toEqual(dto)
  })

  it('map to NoteAuthorListResponse', () => {
    expect(mapping).toBeDefined();
    const dto = noteAuthorListFactory.buildList(2)
    const actual = mapping.toNoteAuthorListResponse(dto)
    actual.forEach((a, i) => expect(a).toEqual(dto[i]))
    expect(actual).toEqual(dto)
  })

});
