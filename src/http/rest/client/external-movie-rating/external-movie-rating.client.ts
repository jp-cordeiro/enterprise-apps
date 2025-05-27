import { Injectable } from '@nestjs/common';
import { HttpClient } from '@src/infra/http/client/http.client';
import { ConfigServiceApp } from '@src/infra/module/config/services/config.service';

interface ApiResponse<T extends Record<string, any>> {
  results: T[];
}

@Injectable()
export class ExternalMovieRatingClient {
  constructor(
    private readonly configServiceApp: ConfigServiceApp,
    private readonly httpClient: HttpClient,
  ) {}
  private fetch<T extends Record<string, any>>(
    path: string,
  ): Promise<ApiResponse<T>> {
    const movieDbApiToken = this.configServiceApp.get('movieDb').apiToken;
    const movieDbApiUrl = this.configServiceApp.get('movieDb').url;
    const url = `${movieDbApiUrl}${path}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${movieDbApiToken}`,
      },
    };
    return this.httpClient.get<ApiResponse<T>>(url, options);
  }

  private async stringToKeywordId(
    keyword: string,
  ): Promise<string | undefined> {
    const apiResponse = await this.fetch<{ id: string }>(
      `/search/keyword?query=${encodeURI(keyword)}&page=1`,
    );
    if (apiResponse.results.length > 0) {
      return apiResponse.results[0].id;
    }
    return undefined;
  }

  async getRating(title: string): Promise<number | undefined> {
    const keywordId = await this.stringToKeywordId(title);
    if (!keywordId) {
      return;
    }
    const apiResponse = await this.fetch<{ vote_average: number }>(
      `/discover/movie?with_keywords=${keywordId}`,
    );
    if (apiResponse.results.length > 0) {
      return apiResponse.results[0].vote_average;
    }
    return undefined;
  }
}
