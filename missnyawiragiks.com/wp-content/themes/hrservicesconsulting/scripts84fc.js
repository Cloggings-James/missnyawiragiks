jQuery(function ($) {
	$(window).load(function () {
		// Use jQuery to add toggles, filters, and anchors to Yoast FAQ
		function extendFaqYoastFunctionality($sections) {

			if ($sections.length > 0) {
				// Extend each FAQ Section on the page
				$sections.each(function () {
					const settings = {
						allShowing: false,
						enableSidebar: false,
						enableToggling: true,
						enableSearch: false
					};

					function toggleAnswer(faq, forceOpen, forceClose) {
						if (settings.enableToggling) {
							const faqIsShowing = $(faq).hasClass('answer-is-showing');
							const toggle = $(faq).find('.answer-toggle');
							const $toggleIcon = $(toggle).find('.fas');
							const $answer = $(faq).find('.schema-faq-answer');

							if (!faqIsShowing && !forceClose || forceOpen) {
								$answer.fadeIn(400);
								$(toggle).attr('aria-label', 'Hide the answer');
								$(faq).addClass('answer-is-showing');
								$toggleIcon.removeClass('fa-plus-circle');
								$toggleIcon.addClass('fa-minus-circle');

							} else if (faqIsShowing || forceClose) {
								$answer.hide();
								$(faq).removeClass('answer-is-showing');
								$(toggle).attr('aria-label', 'Show the answer');
								$toggleIcon.removeClass('fa-minus-circle');
								$toggleIcon.addClass('fa-plus-circle');

							}
						}
					}

					function addToggleEventHandler(question) {
						if (settings.enableToggling) {
							const $toggle = $(question).find('.answer-toggle');
							const $link = $(question).parent();
							const hasAnchor = $link.hasClass('anchor-toggle');

							if (hasAnchor) {
								$link.on('click', function (event) {
									event.preventDefault();
									toggleAnswer($link.parent());
								});

							} else {
								$toggle.on('click', function (event) {
									toggleAnswer($(question).parent());
								});
							}
						}
					}

					// Add the initial answer toggle 
					function addInitialAnswerToggle(question) {
						if (settings.enableToggling) {
							const $faq = $(question).parent();
							const toggle = document.createElement('button');
							const icon = '<i class="fas fa-plus-circle"></i>';
							const id = $faq.attr('id');

							$(toggle).css('background', 'none');
							$(toggle).css('border', 'none');
							$(toggle).attr('role', 'switch');
							$(toggle).attr('aria-checked', 'false');
							$(toggle).addClass('answer-toggle');
							$(toggle).css('margin-left', '1rem');
							$(toggle).html(icon);

							$(question).wrap('<a class="anchor-toggle" href="#' + id + '"></a>');
							$(question).css('display', 'flex');
							$(question).css('justify-content', 'space-between');
							$(question).css('align-items', 'center');

							$(question).append(toggle);

							if (settings.allShowing) {
								toggleAnswer($faq, true);
							}
						}
					}

					const loadFAQs = function ($faqs) {
						$faqs.each(function () {
							const question = $(this).find('.schema-faq-question')[0];

							addInitialAnswerToggle(question);
							addToggleEventHandler(question);

						});
					}
					loadFAQs($sections.children());

					const loadToggleForFullList = function (section) {
						const $filterContainer = $('<div class="filter-container"></div>');
						const $buttonContainer = $('<div class="toggle-all-container"></div>');
						const $button = $('<button class="answers-showing">Hide all answers <i class="fas fa-minus-circle"></i></button>');

						$filterContainer.css('display', 'flex');
						$filterContainer.css('flex-wrap', 'wrap');
						$filterContainer.css('justify-content', 'space-between');
						$buttonContainer.css('display', 'flex');
						$buttonContainer.css('flex', '1');
						$buttonContainer.css('justify-content', 'flex-end');
						$button.css('background', 'none');
						$button.css('border', 'none');
						$button.css('padding', '1rem 6px');
						$button.css('font-size', '2rem');
						$button.addClass('all-answer-toggle');

						function toggleFullList() {
							const answersShowing = $button.hasClass('answers-showing');
							const $answers = $(section).find('.schema-faq-answer');

							$answers.each(function () {

								if (answersShowing) {
									$button.removeClass('answers-showing');
									toggleAnswer($(this).parent(), false, true);
								} else {
									$button.addClass('answers-showing');
									toggleAnswer($(this).parent(), true, false);
								}

							});
						}

						function hideAnswersOnLoad() {
							if (!settings.allShowing) {
								toggleFullList();
							}
						}
						hideAnswersOnLoad();

						$button.on('click', function () {
							toggleFullList();

							if ($button.hasClass('answers-showing')) {
								$button.html('Hide all answers <i class="fas fa-minus-circle"></i>');
							} else {
								$button.html('Show all answers <i class="fas fa-plus-circle"></i>');
							}
						});

						$(section).css('margin-top', '0');
						$(section).css('margin-bottom', '1rem');

						if ($('.schema-faq-section').length > 2) {
							$filterContainer.insertBefore(section);
							$('.filter-container').append($buttonContainer);
							$('.toggle-all-container').append($button);
						}
					}
					loadToggleForFullList(this);

					const loadSearchContainer = function () {
						if (settings.enableSearch) {
							const $container = $('.filter-container');
							const $toggleContainer = $('.toggle-all-container');
							const $searchContainer = $('<div class="search-container"><div id="search-3" class="widget widget_search" style="display:none;"><form role="search" method="get" class="search-form" action="https://www.structuralpanels.ca/"><label><span class="screen-reader-text"></span><input type="search" class="search-field form-control" placeholder="Search …" value="" name="s"></label><button type="submit" class="search-submit"><i class="fa fa-search"></i></button></form></div></div>');

							$searchContainer.css('flex', '1');

							if ($toggleContainer.length > 0) {
								$searchContainer.insertBefore($toggleContainer);
							} else {
								$searchContainer('margin-right', 'auto');
								$container.append($searchContainer);
							}
						}
					};
					loadSearchContainer();
				});
			}
		}
		// Initialize Yoast Faq Toggling
		extendFaqYoastFunctionality($('.schema-faq'));

		function enableBootstrapModal($toggles) {

			let modalHTML = false;
			let myModal = '';

			$toggles.click(function (event) {
				event.preventDefault();


				const content = $('#' + this.dataset.content).data('content');

				if (modalHTML === false) {

					modalHTML = $('<div id="lightbox" class="modal" tabindex="-1"><div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"><div class="modal-content"><div class="modal-header"><button style="background:none;border:none;outline:none;" type="button" class="ml-auto btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-times"></i></button></div><div class="modal-body py-3 px-3 px-lg-5"><p>Modal body text goes here.</p></div></div></div></div>');

					$('body').append(modalHTML);

					myModal = new bootstrap.Modal(document.getElementById('lightbox'));

					$('#lightbox .btn-close').click(event => {
						myModal.toggle();
					});
				}

				myModal.toggle();
				$('.modal-body').html(content);

			});
			function removeAllLinksClass($cards) {
				$cards.each(function (index, card) {
					$(card).find('.open-lightbox').unbind('click');
					$(card).find('.card-title .open-lightbox').unbind('click');

					if ($(card).find('.open-lightbox')) {
						$(card).click(function (event) {
							event.preventDefault();
						});
					}
				});
			}
			removeAllLinksClass($('.remove-all-links'));
		}
		enableBootstrapModal($('.open-lightbox'));

		function enableImageSlider($sliders) {

			function updateMiddleImage($slider) {
				$slider.find('.isShowing').each(function (index, slide) {
					const blankSlide = $(slide).hasClass('empty-slide');
					const scaled = $(slide).find('.inner-slide').css('transform') === 'scale(1.25)';

					if (index === 1 && !scaled && !blankSlide) {
						$(slide).css('z-index', '2');
						$(slide).find('.inner-slide').css('transform', 'scale(1.25)');
						$(slide).css('opacity', '1');
					} else {
						console.log($(slide).find('.inner-slide'));
						$(slide).css('z-index', '1');
						$(slide).find('.inner-slide').css('transform', 'scale(1)');
						$(slide).css('opacity', '.75');
					}
				});
			}

			$sliders.each(function (index, slider) {
				$(slider).height($(slider).height() * 1.5);

				function toggleActiveSlides(slides) {
					$(slides).each(function (index, slide) {
						const blankSlide = $(slide).hasClass('empty-slide');

						if (slide.isIntersecting && !blankSlide) {
							if (!$(slide.target).hasClass('isShowing')) {
								$(slide.target).addClass('isShowing');
							}
						} else {
							if ($(slide.target).hasClass('isShowing')) {
								$(slide.target).removeClass('isShowing');
							}
						}
					});
					updateMiddleImage($(slider));
				}

				let options = {
					root: slider,
					rootMargin: '0px',
					threshold: [0.25, 0.5, 0.75]
				};

				let observer = new IntersectionObserver(toggleActiveSlides, options);

				$(slider).children().each(function (index, slide) {

					$(slide).css('margin-left', '0');
					$(slide).css('margin-right', '0');

					$(slide).css('opacity', '.75');

					observer.observe(slide);
				});
			});

		}
		enableImageSlider($('.slider-container .slider'));

		function initialize_pop_up_modal(hasPopup) {
			if (hasPopup) {
				if (!sessionStorage.getItem('website-popup-displayed')) {
					$('.popup-modal').modal('show');
				}

				$('#popup-notification').on('hidden.bs.modal', function (e) {
					sessionStorage.setItem('website-popup-displayed', true);
				});
			}
		}
		initialize_pop_up_modal($('.popup-modal').length > 0);
		
		function enableHeaderSearch($button) {
			if($button.length > 0) {
				
				function addSearchModal() {
					const searchModal = new bootstrap.Modal(document.getElementById('search_modal'), {
						backgrop: true,
						keyboard: true,
						focus: true
					});
					
					$button.click(function(event) {
						event.preventDefault();
						searchModal.toggle(0);
					});
					
					$('#search_modal').on('shown.bs.modal', function () {
// 						$('#wp-block-search__input-1').focus();
						$('#search_modal form input.orig').focus();
					})
					
				}
				addSearchModal();
			}
		};
		// Enable Search in heaader
		enableHeaderSearch($('#masthead a[href="#search"]'));
		
		function enableJobDescription($descriptions) {
			
			function updateJobStyles() {
				$descriptions.each(function(index, description) {
					$description = $(description);
					let $content = $description.find('.wp-block-group');
					let $header = $description.find('h3');
					
					$content.fadeToggle(400);
					$description.find('.more-and-less').toggleClass('showing-description');
					
					$description.css('margin-bottom', '1rem');
					
					$header.css('cursor', 'pointer');
					$header.css('margin-bottom', '0');
					$header.css('padding', '20px 0');
					$header.addClass('more-and-less');
					$header.addClass('showing-description');
					$header.css('font-weight', 'normal');
					
					$description.css('background-color', '#f4f4f4');
					$description.css('border', '1px solid #d9d9d9');
					$description.css('padding', '0 1rem');
				
				});
			}
			updateJobStyles();
			
			$descriptions.each(function(index, description) {
				$(description).click(function(event) {
					$(this).find('.wp-block-group').fadeToggle(400);
					$(this).find('.more-and-less').toggleClass('showing-description');
				});
			});
		}
		enableJobDescription($('.accordion'));

	});
});