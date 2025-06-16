<template>
    <CustomHeader>
        Загрузка трека
    </CustomHeader>
    <main>
        <SidebarComponent />
        <section
            :class="{
                'main__with__scroll': currentTick === 2
            }"
            class="main"
        >
            <div
                v-if="showSuccessNotification"
                class="success__notification"
            >
                <div class="success__notification__content">
                    <div class="success__notification__content__img">
                        <img src="@/assets/img/success_green.svg" alt="Успешно">
                    </div>
                    <span>Релиз успешно создан!</span>
                    <RouterLink class="success__notification__content__btn">
                        Перейти на страницу с релизом
                    </RouterLink>
                </div>
            </div>
            <div
                v-if="currentTick === 1"
                class="container"
            >
                <transition-group
                    :name="transitionName"
                >
                    <div
                        v-for="(track, index) in tracks"
                        :key="index"
                        v-show="index === currentSection"
                        class="song"
                    >
                        <div class="upload-form">
                            <form class="form" action="#">
                                <div class="form__field">
                                    <label for="title" class="form__field__label">
                                        {{ tracks.length > 1 ? `Название ${index + 1} трека из ${tracks.length}` : 'Название трека' }}
                                    </label>
                                    <input
                                        v-model="track.form.title"
                                        :class="{
                                            'form__field__input__invalid': track.formErrors.title.length > 0,
                                            'form__field__input__success': track.formSuccess.title
                                        }"
                                        id="title"
                                        type="text"
                                        class="form__field__input"
                                    >
                                    <p
                                        v-for="(error, index) in track.formErrors.title"
                                        :key="index"
                                        class="form__field__message"
                                    >
                                        {{ error }}
                                    </p>
                                </div>
                                <div class="form__field">
                                    <label
                                        @dragover.prevent="handleDragOver($event, 'song')"
                                        @dragleave.prevent="handleDragLeave($event, 'song')"
                                        @drop.prevent="handleDrop($event, 'song')"
                                        :class="{ 'form__field__label__input__dragging': track.isDragging.song }"
                                        class="form__field__label form__field__label__input"
                                    >
                                        {{ track.selectedFiles.song ? track.selectedFiles.song.name : 'Файл трека' }}
                                        <input
                                            @change="handleFileChange"
                                            :class="{
                                                'form__field__input__invalid': track.formErrors.song.length > 0,
                                                'form__field__input__success': track.formSuccess.song
                                            }"
                                            type="file"
                                            id="songFile"
                                            accept="audio/*"
                                            class="form__field__input"
                                        >
                                    </label>
                                    <p
                                        v-for="(error, index) in track.formErrors.song"
                                        :key="index"
                                        class="form__field__message"
                                    >
                                        {{ error }}
                                    </p>
                                </div>
                                <div class="form__field">
                                    <label
                                        @dragover.prevent="handleDragOver($event, 'image')"
                                        @dragleave.prevent="handleDragLeave($event, 'image')"
                                        @drop.prevent="handleDrop($event, 'image')"
                                        :class="{
                                            'form__field__label__input__dragging': track.isDragging.image
                                        }"
                                        class="form__field__label form__field__label__input"
                                    >
                                        {{ track.selectedFiles.image ? track.selectedFiles.image.name : 'Обложка' }}
                                        <input
                                            @change="handleFileImageChange"
                                            :class="{
                                                'form__field__input__invalid': track.formErrors.song_img.length > 0,
                                                'form__field__input__success': track.formSuccess.song_img
                                            }"
                                            type="file"
                                            id="songImg"
                                            accept="image/*"
                                            class="form__field__input"
                                        >
                                    </label>
                                    <p
                                        v-for="(error, index) in track.formErrors.song_img"
                                        :key="index"
                                        class="form__field__message"
                                    >
                                        {{ error }}
                                    </p>
                                </div>
                                <div class="form__field">
                                    <label class="form__field__label">
                                        Выберите жанры
                                    </label>
                                    <div
                                        v-if="genresApi.length > 0"
                                        class="form__field__genres"
                                    >
                                        <div
                                            v-for="genre in genresApi"
                                            :key="genre.id"
                                            @click.prevent.stop="handleGenreClick(genre)"
                                            :class="{
                                                'form__field__genres__item__active': track.form.genres.includes(genre.id)
                                            }"
                                            class="form__field__genres__item"
                                        >
                                            <span>
                                                {{ genre.title }}
                                            </span>
                                        </div>
                                    </div>
                                    <p
                                        v-for="(error, index) in track.formErrors.genres"
                                        :key="index"
                                        class="form__field__message"
                                    >
                                        {{ error }}
                                    </p>
                                    <div
                                        v-if="!track.customGenreInputIsVisible && track.form.genres.length < 5"
                                        @click.prevent.stop="track.customGenreInputIsVisible = !track.customGenreInputIsVisible"
                                        class="form__field__genres__item__add"
                                    >
                                        <span>
                                            +
                                        </span>
                                    </div>
                                    <div v-else style="margin-top: 20px;">
                                        <label for="login" class="form__field__label form__field__label__custom__genre">
                                            Название твоего жанра
                                        </label>
                                        <input
                                            v-model="track.form.customGenre"
                                            :class="{
                                                'form__field__input__invalid': track.formErrors.customGenre.length > 0,
                                                'form__field__input__success': track.formSuccess.customGenre
                                            }"
                                            id="login"
                                            type="text"
                                            class="form__field__input"
                                        >
                                        <p
                                            v-for="(error, index) in track.formErrors.customGenre"
                                            :key="index"
                                            class="form__field__message"
                                        >
                                            {{ error }}
                                        </p>
                                    </div>
                                </div>
                                <div class="btn__add__track">
                                    <a
                                        v-if="currentSection > 0"
                                        @click.prevent="scrollToSection('up')"
                                        class="nav-button nav-button-up"
                                    >
                                        Предыдущий трек
                                    </a>
                                    <a
                                        v-if="currentSection < (tracks.length - 1)"
                                        @click.prevent="scrollToSection('down')"
                                        class="nav-button nav-button-up"
                                    >
                                        Следующий трек
                                    </a>
                                    <a
                                        v-if="currentSection === (tracks.length - 1)"
                                        @click.prevent="scrollToSection('down')"
                                        class="nav-button nav-button-down"
                                    >
                                        Добавить еще трек
                                    </a>
                                </div>
                                <div class="btn__remove__track">
                                    <a
                                        v-if="currentSection > 0 || tracks.length > 1"
                                        @click.prevent.stop="removeTrack(currentSection)"
                                    >
                                        Удалить этот трек
                                    </a>
                                </div>

                            </form>
                        </div>
                        <div class="upload_song">
                            <div class="upload_song__img">
                                <img
                                    :src="track.imagePreview || '/src/assets/img/default.png'"
                                    alt="Обложка трека"
                                >
                            </div>
                            <div
                                :class="{
                                    'upload_song__info__with_genres': track.form.genres.length > 0 || track.form.customGenre
                                }"
                                class="upload_song__info"
                            >
                                <span class="upload_song__info__song__name">
                                    {{ track.form.title ? track.form.title : "*без названия*" }}
                                </span>
                                <span class="upload_song__info__artist">
                                    {{ getSingerName }}
                                </span>
                            </div>
                            <div class="upload__song__genres">
                                <span
                                    v-for="(genre, index) in track.form.genres"
                                    :key="index"
                                    class="upload__song__genres__item"
                                >
                                    {{ genresApi.find(g => g.id === genre).title }}
                                </span>
                                <span
                                    v-if="track.form.customGenre"
                                    class="upload__song__genres__item"
                                >
                                    {{ track.form.customGenre }}
                                </span>
                            </div>
                        </div>
                        <button
                            @click.prevent.stop="nextTick"
                            type="submit"
                            class="upload__next__btn"
                        >
                            <span>Перейти к следующему шагу</span>
                        </button>
                    </div>
                </transition-group>
            </div>
            <div v-else-if="currentTick === 2" class="upload__track__final">
                <button
                    @click.prevent.stop="prevTick"
                    type="submit"
                    class="upload__prev__btn"
                >
                    <span>Вернуться к предыдущему шагу</span>
                </button>
                <span class="upload__track__final__heading">
                    {{ tracks.length > 1 ? 'Твои загруженные треки' : 'Твой загруженный трек'}}
                </span>
                <ul class="upload__track__final__list">
                    <li
                        v-for="(track, index) in tracks"
                        :key="index"
                        class="upload__track__final__list__item"
                    >
                        <div
                            v-if="tracks.length > 1"
                            class="upload__track__final__list__item__id"
                        >
                            № {{ index + 1 }}
                        </div>
                        <div class="upload__track__final__list__item__song">
                            <div class="upload__track__final__list__item__song__img">
                                <img
                                    :src="track.imagePreview || '/src/assets/img/default.png'"
                                    alt="aaa"
                                >
                            </div>
                            <div class="upload__track__final__list__item__song__info">
                                <div class="upload__track__final__list__item__song__info__title">
                                    {{ track.form.title }}
                                </div>
                                <div class="upload__track__final__list__item__song__info__artist">
                                    {{ getSingerName }}
                                </div>
                            </div>
                            <div
                                v-if="track.form.genres.length > 0"
                                class="upload__track__final__list__item__song__genres"
                            >
                                <span
                                    v-for="(genre, index) in track.form.genres"
                                    :key="index"
                                    @click.prevent.stop="removeGenre(track, genre)"
                                >
                                    {{ genresApi.find(g => g.id === genre).title }}
                                </span>
                                <span
                                    v-if="track.form.customGenre"
                                >
                                    {{ track.form.customGenre }}
                                </span>
                            </div>
                        </div>
                        <div class="upload__track__final__list__item__status">
                            <div
                                v-if="track.isLoading"
                                class="loader"
                            >
                            </div>
                            <div
                                v-else-if="Object.values(track.formSuccess).every(value => value === true)"
                                class="success"
                            >
                                <img src="@/assets/img/success_green.svg" alt="Успешно">
                            </div>
                            <div
                                v-else-if="Object.values(track.formErrors).some(value => value.length > 0)"
                                class="error"
                            >
                                <div class="img">
                                    <img src="@/assets/img/error_red.svg" alt="Ошибка">
                                </div>
                            </div>
                            <div
                                v-else-if="tracks.length > 1"
                                class="close"
                                @click.prevent.stop="removeTrack(index)"
                            >
                                <img src="@/assets/img/close_gray.svg" alt="Удалить">
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="upload__track__final__form">
                    <div class="upload__track__final__form__heading">
                        Заполни информацию о релизе
                    </div>
                    <div class="form__field">
                        <label for="title_release" class="form__field__label">
                            Название
                        </label>
                        <input
                            v-model="releaseForm.title"
                            :class="{
                                'form__field__input__invalid': releaseFormErrors.title.length > 0,
                                'form__field__input__success': releaseFormSuccess.title
                            }"
                            id="title_release"
                            type="text" class="form__field__input"
                        >
                        <p
                            v-for="(error, index) in releaseFormErrors.title"
                            :key="index"
                            class="form__field__message"
                        >
                            {{ error }}
                        </p>
                    </div>
                    <div class="form__field">
                        <label for="title_release" class="form__field__label">
                            Выпустить сразу
                        </label>
                        <label class="form__field__label__checkbox">
                            <input
                                v-model="releaseForm.straight"
                                id="title_release"
                                type="checkbox"
                                class="form__field__input"
                            >
                        </label>
                    </div>
                    <div v-if="!releaseForm.straight" class="form__field__list">
                        <div class="form__field">
                            <label for="title_release" class="form__field__label">
                                Дата
                            </label>
                            <input
                                v-model="releaseForm.date"
                                :class="{
                                    'form__field__input__invalid': releaseFormErrors.date.length > 0,
                                    'form__field__input__success': releaseFormSuccess.date
                                }"
                                id="title_release"
                                type="date"
                                class="form__field__input"
                            >
                            <p
                                v-for="(error, index) in releaseFormErrors.date"
                                :key="index"
                                class="form__field__message"
                            >
                                {{ error }}
                            </p>
                        </div>
                        <div class="form__field">
                            <label for="title_release" class="form__field__label">
                                Время
                            </label>
                            <input
                                v-model="releaseForm.time"
                                :class="{
                                    'form__field__input__invalid': releaseFormErrors.time.length > 0,
                                    'form__field__input__success': releaseFormSuccess.time
                                }"
                                id="title_release"
                                type="time"
                                class="form__field__input"
                            >
                            <p
                                v-for="(error, index) in releaseFormErrors.time"
                                :key="index"
                                class="form__field__message"
                            >
                                {{ error }}
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    @click.prevent.stop="fetchUploadSongs"
                    :class="{ 'form__button__loading': isLoading }"
                    type="submit"
                    class="upload__track__final__submit"
                >
                    <span>Отправить</span>
                </button>
            </div>
        </section>
    </main>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken', 'isSinger', 'getSingerName', 'getSingerId']),
        transitionName() {
            return this.direction === 'up' ? 'slide-down' : 'slide-up';
        },
        currentTrack() {
            return this.tracks[this.currentSection]
        },
        hasReleaseFormErrors() {
            return Object.values(this.releaseFormErrors).some(errors => errors.length > 0);
        },
        allTracksSuccess() {
            return this.tracks.every(track => track.isSuccessLoading);
        }
    },
    data() {
        return {
            isLoading: false,
            tracks: [
                {
                    customGenreInputIsVisible: false,
                    isDragging: {
                        song: false,
                        image: false
                    },
                    selectedFiles: {
                        song: null,
                        image: null
                    },
                    imagePreview: null,
                    isLoading: false,
                    isSuccessLoading: false,
                    form: {
                        title: '',
                        songFile: null,
                        songImg: null,
                        genres: [],
                        customGenre: '',
                    },
                    formErrors: {
                        title: [],
                        song: [],
                        song_img: [],
                        song_title: [],
                        genres: [],
                        customGenre: [],
                    },
                    formSuccess: {
                        title: false,
                        song: false,
                        song_img: false,
                        song_title: false,
                        genres: false,
                        customGenre: false,
                    },
                }
            ],
            releaseForm: {
                title: '',
                date: '',
                time: '',
                straight: false,
                singers: []
            },
            releaseFormErrors: {
                title: [],
                date: [],
                time: [],
                singers: [],
            },
            releaseFormSuccess: {
                title: false,
                date: false,
                time: false,
                singers: true,
            },
            currentSection: 0,
            currentTick: 1,
            genresApi: [],
            direction: 'down',
            releaseInfo: {
                id: null,
                releaseCreate: false,
            },
            showSuccessNotification: false,
        }
    },
    methods: {
        nextTick() {
            let allTracksValid = true;

            this.tracks.forEach(track => {
                this.validateTrackForm(track);
                if (Object.values(track.formErrors).some(errors => errors.length > 0)) {
                    allTracksValid = false;
                }
            });

            if (allTracksValid) {
                this.currentTick++;
            }
        },
        prevTick() {
            this.currentTick--;
        },
        addTrack() {
            this.tracks.push({
                isDragging: {
                    song: false,
                    image: false
                },
                selectedFiles: {
                    song: null,
                    image: null
                },
                imagePreview: null,
                isLoading: false,
                isSuccessLoading: false,
                form: {
                    title: '',
                    songFile: null,
                    songImg: null,
                    genres: [],
                    customGenre: '',
                },
                formErrors: {
                    title: [],
                    song: [],
                    song_img: [],
                    song_title: [],
                    genres: [],
                    customGenre: [],
                },
                formSuccess: {
                    title: false,
                    song: false,
                    song_img: false,
                    song_title: false,
                    genres: false,
                    customGenre: false,
                },
            });
        },
        scrollToSection(direction) {
            this.direction = direction;

            if (direction === 'up' && this.currentSection > 0) {
                this.currentSection--;
            } else if (direction === 'down') {
                if (this.currentSection === this.tracks.length - 1) {
                    this.validateTrackForm(this.currentTrack);
                    console.log(this.currentTrack.formErrors);
                    if (Object.values(this.currentTrack.formErrors).some(errors => errors.length > 0)) {
                        return;
                    }

                    this.addTrack();
                }
                this.currentSection++;
            }
        },
        handleGenreClick(genre) {
            if (this.currentTrack.form.genres.includes(genre.id)) {
                this.currentTrack.form.genres = this.currentTrack.form.genres.filter(id => id !== genre.id);
            } else {
                this.currentTrack.form.genres.push(genre.id);
            }
        },
        async fetchGenres() {
            try {
                const response = await fetch(this.getFullApiUrl('api/genre'), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.genresApi = data.data
                }

                if (response.status > 399) {
                    if (data.error?.errors) {
                        console.log(data);
                    }
                }
            } catch (error) {
                throw error;
            }
        },
        handleFileChange(event) {
            const file = event.target.files[0];

            if (file) {
                this.currentTrack.form.songFile = file;
                this.currentTrack.selectedFiles.song = file;
            }
        },
        handleFileImageChange(event) {
            const file = event.target.files[0];

            if (file) {
                this.currentTrack.form.songImg = file;
                this.currentTrack.selectedFiles.image = file;
                this.createImagePreview(file);
            }
        },
        handleSubmit() {
            if (!this.isSinger) {
                this.$router.push('/create-singer-profile');
                return;
            }

            this.fetchUploadSong();
        },
        async fetchUploadSongs() {
            try {
                this.isLoading = true;

                if (null === this.releaseInfo.id) {
                    this.validateReleaseForm();

                    if (this.hasReleaseFormErrors) {
                        return;
                    }

                    await this.fetchCreateRelease();
                }

                if (this.releaseInfo.releaseCreate) {
                    this.tracks.forEach(track => this.fetchUploadSong(track));
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        },
        async fetchCreateRelease() {
            try {
                const response = await fetch(this.getFullApiUrl('api/release'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.getAuthToken,
                    },
                    body: JSON.stringify(this.releaseForm)
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.releaseInfo.id = data.data.release_id;
                    this.releaseInfo.releaseCreate = true;
                    return true;
                }

                if (response.status > 399) {
                    this.releaseInfo.id = null;
                    this.releaseInfo.releaseCreate = false;
                    return false;
                }
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        async fetchUploadSong(track) {
            try {
                track.isLoading = true;
                this.clearFormErrors(track);
                this.clearFormSuccess(track);

                const formData = new FormData();
                formData.append('song_title', track.form.title);
                formData.append('song', track.form.songFile);
                formData.append('song_img', track.form.songImg);
                formData.append('genres', track.form.genres.join(','));
                formData.append('custom_genre', track.form.customGenre);
                formData.append('release_id', this.releaseInfo.id);

                const response = await fetch(this.getFullApiUrl('api/song'), {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    track.isSuccessLoading = true;
                    this.setSuccess(track, []);
                }

                if (response.status > 399) {
                    if (data.error?.errors) {
                        const errors = data.error.errors;

                        this.setErrors(track, errors);
                    }
                }
            } catch (error) {
                throw error;
            } finally {
                track.isLoading = false;
            }
        },
        clearFormErrors(track) {
            Object.keys(track.formErrors).forEach(field => {
                track.formErrors[field] = [];
            });
        },
        clearFormSuccess(track) {
            Object.keys(track.formSuccess).forEach(field => {
                track.formSuccess[field] = false;
            });
        },
        setSuccess(track, errors) {
            Object.keys(track.formSuccess).forEach(field => {
                track.formSuccess[field] = errors[field] ? false : true;
            });
        },
        setErrors(track, errors) {
            Object.keys(track.formErrors).forEach(field => {
                if (errors[field]) {
                    track.formErrors[field] = Array.isArray(errors[field])
                        ? errors[field]
                        : [errors[field]];
                }
            });
        },
        handleDragOver(event, type) {
            this.currentTrack.isDragging[type] = true;
        },
        handleDragLeave(event, type) {
            this.currentTrack.isDragging[type] = false;
        },
        handleDrop(event, type) {
            this.currentTrack.isDragging[type] = false;
            const file = event.dataTransfer.files[0];

            if (type === 'song' && file.type.startsWith('audio/')) {
                this.currentTrack.form.songFile = file;
                this.currentTrack.selectedFiles.song = file;
                this.handleFileChange({ target: { files: [file] } });
            } else if (type === 'image' && file.type.startsWith('image/')) {
                this.currentTrack.form.songImg = file;
                this.currentTrack.selectedFiles.image = file;
                this.createImagePreview(file);
                this.handleFileImageChange({ target: { files: [file] } });
            }
        },
        createImagePreview(file) {
            if (this.currentTrack.imagePreview) {
                URL.revokeObjectURL(this.currentTrack.imagePreview);
            }

            this.currentTrack.imagePreview = URL.createObjectURL(file);
        },
        removeTrack(index) {
            if (this.tracks.length > 1) {
                this.tracks.splice(index, 1);

                if (this.currentSection >= this.tracks.length) {
                    this.currentSection = this.tracks.length - 1;
                }
            }
        },
        validateReleaseForm() {
            // Очищаем предыдущие ошибки
            Object.keys(this.releaseFormErrors).forEach(field => {
                this.releaseFormErrors[field] = [];
            });

            // Очищаем предыдущие успешные статусы
            Object.keys(this.releaseFormSuccess).forEach(field => {
                this.releaseFormSuccess[field] = false;
            });

            // Валидация title
            if (!this.releaseForm.title || this.releaseForm.title.trim() === '') {
                this.releaseFormErrors.title.push('Название релиза обязательно');
            } else {
                this.releaseFormSuccess.title = true;
            }

            // Если straight установлен в true, проверяем актуальность времени
            if (this.releaseForm.straight) {
                const now = new Date();
                const [hours, minutes] = this.releaseForm.time.split(':');
                const selectedTime = new Date();
                selectedTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                // Если прошло больше минуты с момента установки времени
                if (now.getTime() - selectedTime.getTime() > 60000) {
                    // Обновляем время на текущее
                    const currentHours = String(now.getHours()).padStart(2, '0');
                    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
                    this.releaseForm.time = `${currentHours}:${currentMinutes}`;
                }

                this.releaseFormSuccess.date = true;
                this.releaseFormSuccess.time = true;
                return;
            }

            // Валидация date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(this.releaseForm.date);
            selectedDate.setHours(0, 0, 0, 0);

            if (!this.releaseForm.date) {
                this.releaseFormErrors.date.push('Дата релиза обязательна');
            } else if (selectedDate < today) {
                this.releaseFormErrors.date.push('Дата релиза не может быть в прошлом');
            } else {
                this.releaseFormSuccess.date = true;
            }

            // Валидация time
            if (!this.releaseForm.time) {
                this.releaseFormErrors.time.push('Время релиза обязательно');
            } else if (selectedDate.getTime() === today.getTime()) {
                const [hours, minutes] = this.releaseForm.time.split(':');
                const selectedTime = new Date();
                selectedTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                if (selectedTime < new Date()) {
                    this.releaseFormErrors.time.push('Время релиза не может быть в прошлом');
                } else {
                    this.releaseFormSuccess.time = true;
                }
            } else {
                this.releaseFormSuccess.time = true;
            }
        },
        validateTrackForm(track) {
            // Очищаем предыдущие ошибки
            this.clearFormErrors(track);
            // Очищаем предыдущие успешные статусы
            this.clearFormSuccess(track);

            // Валидация title
            if (!track.form.title || track.form.title.trim() === '') {
                track.formErrors.title.push('Название трека обязательно');
            } else {
                track.formSuccess.title = true;
            }

            // Валидация songFile
            if (!track.form.songFile) {
                track.formErrors.song.push('Файл трека обязателен');
            } else if (!track.form.songFile.type.startsWith('audio/')) {
                track.formErrors.song.push('Файл должен быть аудио формата');
            } else {
                track.formSuccess.song = true;
            }

            // Валидация songImg
            if (!track.form.songImg) {
                track.formErrors.song_img.push('Обложка трека обязательна');
            } else if (!track.form.songImg.type.startsWith('image/')) {
                track.formErrors.song_img.push('Файл должен быть изображением');
            } else {
                track.formSuccess.song_img = true;
            }

            // Валидация genres
            if (track.form.genres.length === 0) {
                track.formErrors.genres.push('Выберите хотя бы один жанр');
            } else if (track.form.genres.length > 5) {
                track.formErrors.genres.push('Максимальное количество жанров - 5');
            } else {
                track.formSuccess.genres = true;
            }

            // Валидация customGenre (необязательное поле)
            if (track.form.customGenre && track.form.customGenre.trim() !== '') {
                track.formSuccess.customGenre = true;
            }
        },
    },
    created() {
        this.releaseForm.singers = [this.getSingerId];
    },
    mounted() {
        this.fetchGenres();
    },
    watch: {
        'releaseForm.straight': {
            handler(newValue) {
                if (newValue) {
                    const now = new Date();

                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    this.releaseForm.date = `${year}-${month}-${day}`;

                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    this.releaseForm.time = `${hours}:${minutes}`;
                }
            },
            immediate: true
        },
        allTracksSuccess(newValue) {
            if (newValue) {
                this.showSuccessNotification = true;
            }
        }
    }
}
</script>

<style scoped>
body {
    background-color: black;
    position: relative;
    max-height: 100vh;
}

main {
    margin: 0px 20px 10px 20px;
    display: flex;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: .5s all ease;
}

.main {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
    background-color: #121212;

    .container {
        width: 100%;
        height: 100%;
        background-color: #121212;
        padding-top: 50px;
        position: relative;
        overflow: hidden;

        .song {
            display: flex;
            gap: 100px;
            position: relative;
            width: 100%;
            height: 100%;
            background-color: #121212;
        }

        .upload_song {
            max-width: 300px;
            padding: 20px;
            border: 1px rgba(255, 255, 255, 0.1) solid;
            border-radius: 20px;
            align-self: flex-start;

            .upload_song__img {
                width: 100%;
                aspect-ratio: 1/1;
                border-radius: 10px;
                overflow: hidden;
                margin-bottom: 15px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .upload_song__info {
                display: flex;
                flex-direction: column;
                gap: 10px;

                &.upload_song__info__with_genres {
                    margin-bottom: 15px;
                }

                .upload_song__info__song__name {
                    font-size: 20px;
                    font-family: 'UnboundedBold', sans-serif;
                    font-weight: 700;
                    color: #e0e0e0;
                }

                .upload_song__info__artist {
                    font-size: 12px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #9e9e9e;
                }
            }

            .upload__song__genres {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;

                .upload__song__genres__item {
                    background-color: #333333;
                    border-radius: 10px;
                    padding: 10px 15px;
                    border: 2px solid transparent;
                    cursor: pointer;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    font-size: 16px;
                    color: #e0e0e0;
                }
            }
        }
    }

    .upload-form {
        padding: 20px;
        margin-bottom: 30px;

        .form {
            display: flex;
            flex-direction: column;
            gap: 35px;
            width: 100%;
            max-width: 350px;

            .form__field__genres__item__add {
                background-color: #333333;
                border-radius: 10px;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 400;
                font-size: 16px;
                color: #e0e0e0;
                cursor: pointer;
                transition: .2s;
                border: 2px solid transparent;
                padding: 10px 0px;
                margin-top: 10px;

                &:hover {
                    border: 2px solid #e0e0e0;
                }
            }

            .form__field {
                display: flex;
                flex-direction: column;

                .form__field__genres {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;

                    .form__field__genres__item {
                        background-color: #333333;
                        border-radius: 10px;
                        padding: 10px 15px;
                        border: 2px solid transparent;
                        cursor: pointer;
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        font-size: 16px;
                        color: #e0e0e0;
                        transition: .2s;

                        &:hover {
                            border: 2px solid #e0e0e0;
                        }
                    }

                    .form__field__genres__item__active {
                        border: 2px solid #e0e0e0;
                    }
                }

                .form__field__label {
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #e0e0e0;
                    font-size: 16px;
                    margin-bottom: 13px;
                    letter-spacing: 1px;

                    &.form__field__label__custom__genre {
                        display: block;
                    }

                    &.form__field__label__input {
                        border: 3px #9e9e9e dashed;
                        transition: .2s all;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 30px 0px;
                        color: #9e9e9e;
                        border-radius: 10px;
                        margin-bottom: 0;

                        &:hover {
                            border: 3px #e0e0e0 solid;
                            color: #e0e0e0;
                        }

                        &.form__field__label__input__dragging {
                            border: 3px #e0e0e0 solid;
                            background-color: rgba(224, 224, 224, 0.1);
                            color: #e0e0e0;
                        }

                        &:has(input.form__field__input__invalid) {
                            border: 3px solid #BB271A;
                        }

                        &:has(input.form__field__input__success) {
                            border: 3px solid #78a75a;
                        }

                        input {
                            display: none;
                        }
                    }
                }

                .form__field__input {
                    box-sizing: border-box;
                    outline: 1px solid #e0e0e0;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    font-size: 16px;
                    color: #e0e0e0;
                    padding: 10px 15px;
                    border-radius: 10px;
                    transition: all 0.2s;

                    &:hover {
                        outline: 2px solid #e0e0e0;
                    }

                    &:focus {
                        outline: 2px solid #e0e0e0;
                    }

                    &.form__field__input__success {
                        outline: 2px solid #78A75A;
                    }

                    &.form__field__input__invalid {
                        outline: 2px solid #BB271A;
                    }
                }

                .form__field__message {
                    color: #BB271A;
                    font-size: 13px;
                    margin-top: 10px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                }
            }

            .form__button {
                margin-top: 15px;
                font-family: 'UnboundedBold', sans-serif;
                font-weight: 400;
                background-color: #e0e0e0;
                border: none;
                padding: 20px;
                letter-spacing: 1px;
                border-radius: 15px;
                transition: .2s;
                color: #333333;
                position: relative;

                &:hover {
                    border-radius: 10px;
                }

                &.form__button__loading {
                    span {
                        color: transparent;
                    }

                    &::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 20px;
                        height: 20px;
                        border: 2px solid #333333;
                        border-radius: 50%;
                        border-top-color: transparent;
                        animation: spin 1s linear infinite;
                    }
                }
            }
        }
    }

    .upload__track__final {
        padding-top: 50px;
        padding-left: 30px;

        .upload__track__final__heading {
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 700;
            font-size: 30px;
            color: #e0e0e0;
            margin-bottom: 25px;
            display: block;
        }

        .upload__track__final__list {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .upload__track__final__list__item {
                display: flex;
                align-items: center;
                gap: 20px;

                &:has(.error) {
                    .upload__track__final__list__item__song {
                        outline: 2px solid #bb271a;
                        border: 1px solid transparent;
                    }
                }

                &:has(.success) {
                    .upload__track__final__list__item__song {
                        outline: 2px solid #78a75a;
                        border: 1px solid transparent;
                    }
                }

                .upload__track__final__list__item__id {
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 700;
                    font-size: 20px;
                    color: #9e9e9e;
                }

                .upload__track__final__list__item__song {
                    padding: 10px 20px 10px 10px;
                    border: 1px solid rgba(255, 255, 255, .1);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 20px;

                    .upload__track__final__list__item__song__img {
                        width: 75px;
                        height: 75px;
                        border-radius: 10px;
                        overflow: hidden;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    .upload__track__final__list__item__song__info {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;

                        .upload__track__final__list__item__song__info__title {
                            font-family: 'UnboundedBold', sans-serif;
                            font-size: 18px;
                            color: #e0e0e0;
                        }

                        .upload__track__final__list__item__song__info__artist {
                            font-family: 'BoundedVariable', sans-serif;
                            font-weight: 700;
                            font-size: 15px;
                            color: #9e9e9e;
                        }
                    }

                    .upload__track__final__list__item__song__genres {
                        padding-left: 20px;
                        border-left: 1px solid rgba(255, 255, 255, .1);
                        align-self: stretch;
                        display: flex;
                        align-items: center;
                        column-gap: 13px;
                        flex-wrap: wrap;
                        max-width: 200px;

                        span {
                            border-radius: 5px;
                            padding: 5px 10px;
                            background-color: #2c2c2c;
                            font-family: 'BoundedVariable', sans-serif;
                            font-weight: 700;
                            font-size: 13px;
                            color: #9e9e9e;
                        }
                    }
                }

                .upload__track__final__list__item__status {
                    .loader {
                        width: 36px;
                        height: 36px;
                        border: 4px solid #e0e0e0;
                        border-radius: 50%;
                        border-top-color: transparent;
                        animation: spin_two 1s linear infinite;
                    }

                    .success {
                        width: 45px;
                        height: 45px;
                        overflow: hidden;
                        animation: slideUp 0.3s ease-out;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    .error {
                        .img {
                            width: 35px;
                            height: 35px;
                            overflow: hidden;
                            animation: shake 0.35s ease-in-out;

                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                            }
                        }
                    }

                    .close {
                        width: 37px;
                        height: 37px;
                        overflow: hidden;
                        cursor: pointer;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                }
            }
        }

        .upload__track__final__form {
            margin-top: 100px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .upload__track__final__form__heading {
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 700;
                font-size: 30px;
                color: #e0e0e0;
                margin-bottom: 25px;
                display: block;
            }

            .form__field__list {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
            }

            .form__field {
                display: flex;
                flex-direction: column;
                margin-bottom: 20px;

                &:last-child {
                    margin-bottom: 0;
                }

                .form__field__genres {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;

                    .form__field__genres__item {
                        background-color: #333333;
                        border-radius: 10px;
                        padding: 10px 15px;
                        border: 2px solid transparent;
                        cursor: pointer;
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        font-size: 16px;
                        color: #e0e0e0;
                        transition: .2s;

                        &:hover {
                            border: 2px solid #e0e0e0;
                        }
                    }

                    .form__field__genres__item__active {
                        border: 2px solid #e0e0e0;
                    }
                }

                .form__field__label {
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #e0e0e0;
                    font-size: 16px;
                    margin-bottom: 13px;
                    letter-spacing: 1px;

                    &.form__field__label__custom__genre {
                        display: block;
                    }

                    &.form__field__label__input {
                        border: 3px #9e9e9e dashed;
                        transition: .2s all;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 30px 0px;
                        color: #9e9e9e;
                        border-radius: 10px;

                        &:hover {
                            border: 3px #e0e0e0 solid;
                            color: #e0e0e0;
                        }

                        &.form__field__label__input__dragging {
                            border: 3px #e0e0e0 solid;
                            background-color: rgba(224, 224, 224, 0.1);
                            color: #e0e0e0;
                        }

                        input {
                            display: none;
                        }
                    }
                }

                .form__field__input {
                    box-sizing: border-box;
                    outline: 1px solid #e0e0e0;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    font-size: 16px;
                    color: #e0e0e0;
                    padding: 10px 15px;
                    border-radius: 10px;
                    transition: all 0.2s;

                    &:hover {
                        outline: 2px solid #e0e0e0;
                    }

                    &:focus {
                        outline: 2px solid #e0e0e0;
                    }

                    &.form__field__input__success {
                        outline: 2px solid #78A75A;
                    }

                    &.form__field__input__invalid {
                        outline: 2px solid #BB271A;
                    }
                }

                .form__field__message {
                    color: #BB271A;
                    font-size: 13px;
                    margin-top: 10px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                }

                .form__field__label__checkbox {
                    input {
                        display: none;
                    }

                    width: 60px;
                    border-radius: 999px;
                    border: 4px solid transparent;
                    aspect-ratio: 2 / 1;
                    background-color: #2c2c2c;
                    outline: 1px solid #e0e0e0;
                    position: relative;
                    display: block;
                    transition: .2s;

                    &::before {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        aspect-ratio: 1 / 1;
                        background-color: #121212;
                        border-radius: 999px;
                        transition: .2s;
                    }

                    &:hover {
                        outline: 2px solid #e0e0e0;
                    }

                    &:has(input:checked) {
                        background-color: #e0e0e0;

                        &::before {
                            right: 0;
                            left: 30px;
                        }
                    }
                }
            }
        }
    }
}

.main__with__scroll {
    overflow: scroll;
}

@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

@keyframes spin_two {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes shake {
    0%, 100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-5px);
    }
    50% {
        transform: translateX(5px);
    }
    75% {
        transform: translateX(-5px);
    }
}

@keyframes slideUp {
    0% {
        transform: translateY(10px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

.btn__add__track {
    display: flex;
    gap: 15px;

    a {
        background-color: #2c2c2c;
        padding: 10px 15px;
        border-radius: 10px;
        cursor: pointer;
        font-family: 'BoundedVariable', sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #e0e0e0;
        transition: .2s;
        border: 2px solid transparent;

        &:hover {
            border: 2px solid #e0e0e0;
        }

        &.nav-button-up {
            background-color: transparent;
        }
    }
}

.btn__remove__track {
    a {
        background-color: #2c2c2c;
        padding: 10px 15px;
        border-radius: 10px;
        cursor: pointer;
        font-family: 'BoundedVariable', sans-serif;
        font-weight: 400;
        font-size: 16px;
        color: #e0e0e0;
        transition: .2s;
        border: 2px solid transparent;

        &:hover {
            border: 2px solid #e0e0e0;
        }

        &.nav-button-up {
            background-color: transparent;
        }
    }
}

.upload__next__btn {
    background-color: #e0e0e0;
    padding: 10px 15px;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'BoundedVariable', sans-serif;
    font-weight: 400;
    font-size: 16px;
    color: #121212;
    transition: .2s;
    border: 2px solid transparent;
    align-self: flex-end;
    position: relative;
    bottom: 100px;

    &:hover {
        scale: 1.03;
    }
}

.upload__prev__btn {
    background-color: #e0e0e0;
    padding: 10px 15px;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'BoundedVariable', sans-serif;
    font-weight: 400;
    font-size: 16px;
    color: #121212;
    transition: .2s;
    border: 2px solid transparent;
    margin-bottom: 50px;

    &:hover {
        scale: 1.03;
    }
}

.upload__track__final__submit {
    margin-top: 50px;
    background-color: #e0e0e0;
    padding: 20px 30px;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'BoundedVariable', sans-serif;
    font-weight: 400;
    font-size: 17px;
    color: #121212;
    transition: .2s;
    border: 2px solid transparent;
    margin-bottom: 30px;

    &:hover {
        scale: 1.03;
    }

    &.form__button__loading {
        span {
            color: transparent;
        }

        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 2px solid #333333;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
        }
    }
}

.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.5s ease;
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
}

.slide-up-enter-from {
    transform: translateY(100%);
}

.slide-up-enter-to {
    transform: translateY(0);
}

.slide-up-leave-from {
    transform: translateY(0);
}

.slide-up-leave-to {
    transform: translateY(-100%);
}

.slide-down-enter-from {
    transform: translateY(-100%);
}

.slide-down-enter-to {
    transform: translateY(0);
}

.slide-down-leave-from {
    transform: translateY(0);
}

.slide-down-leave-to {
    transform: translateY(100%);
}

.success__notification {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;

    .success__notification__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        animation: scaleIn 0.3s ease-out;

        .success__notification__content__img {
            width: 175px;
            height: 175px;
            position: relative;

            &::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(120, 167, 90, 0.4) 0%, rgba(120, 167, 90, 0) 70%);
                animation: wave 3s ease-out infinite;
                z-index: -1;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: relative;
                z-index: 1;
            }
        }

        span {
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 700;
            font-size: 24px;
            color: #e0e0e0;
            display: block;
        }

        .success__notification__content__btn {
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 700;
            font-size: 17px;
            color: #121212;
            display: block;
            padding: 10px 20px;
            background-color: #e0e0e0;
            border-radius: 10px;
            transition: .2s;

            &:hover {
                scale: 1.03;
            }

        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes wave {
    0% {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0;
    }
}
</style>
