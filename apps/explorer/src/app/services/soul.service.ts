import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Attributes } from '../models/metadata';
import { SNIData, SNIList } from '../models/sni';
import { Soul, SoulFilter } from '../models/soul';
import { SOULS_LIST } from '../queries/sni';

@Injectable({
  providedIn: 'root',
})
export class SoulService {
  private subject = new BehaviorSubject<SoulFilter>({
    searchById: '',
    soulStatus: -1,
    createdDate: 0,
    updatedDate: 0,
  });
  filteredSouls$: Observable<SoulFilter> = this.subject.asObservable();

  constructor(private apollo: Apollo, private http: HttpClient) {}

  getSoulsList(lastId: string): Observable<Soul[]> {
    return this.apollo
      .watchQuery<SNIList>({
        query: SOULS_LIST,
        variables: {
          offset: lastId,
        },
      })
      .valueChanges.pipe(
        map((val) => val.data.snis),
        shareReplay()
      );
  }

  getSoulDataById(
    soulId: string,
    query: DocumentNode
  ): Observable<Partial<Soul>> {
    return this.apollo
      .watchQuery<SNIData>({
        query,
        variables: {
          sniId: soulId,
        },
      })
      .valueChanges.pipe(
        map((val) => val?.data?.sni),
        map((data) => this.removeTypeName(data)),
        shareReplay()
      );
  }

  setFilterToSouls(data: SoulFilter) {
    this.subject.next(data);
  }

  removeTypeName(data: Soul) {
    return JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (key === '__typename') return;
        return value;
      })
    );
  }

  filterByCondition(atts: Attributes[], attributeSelector: boolean) {
    const treatedImages = [
      'whisker_right_0',
      'whisker_right_1',
      'whisker_right_2',
      'whisker_left_0',
      'whisker_left_1',
      'whisker_left_2',
      'ear_right',
      'ear_left',
      'face',
      'mouth',
      'profile',
    ];

    return atts.filter((att) =>
      attributeSelector
        ? treatedImages.includes(att.trait_type)
        : !treatedImages.includes(att.trait_type)
    );
  }
}
