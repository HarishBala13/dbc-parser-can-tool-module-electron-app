import { TestBed } from '@angular/core/testing';

import { DbcParserService } from './dbc-parser.service';

describe('DbcParserService', () => {
  let service: DbcParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbcParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
