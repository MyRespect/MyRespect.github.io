---
layout: page
title: Research
permalink: /research/
icon: flag
body_class: research-page-layout
page_class: research-page
sidebar: research
description: "Publications by Guangjing Wang on agentic AI security, vision and speech security, distributed learning, systems security and privacy, and sensing privacy."
updated: 2026-10-24
---

* content
{:toc}




{% for direction in site.data.research_directions %}
{% assign publications = site.data.publications | where: 'direction', direction.id %}
{% assign publication_years = publications | group_by: 'year' | sort: 'name' | reverse %}
<section class="research-direction" id="{{ direction.id }}" aria-labelledby="{{ direction.id }}-title">
    <h2 id="{{ direction.id }}-title">{{ direction.title | escape }}</h2>
    <ul class="publication-list">
        {% for year in publication_years %}
        {% for publication in year.items %}
        {% unless publication.kind contains 'Preprint' %}
        {% include publication.html publication=publication %}
        {% endunless %}
        {% endfor %}
        {% endfor %}
    </ul>
</section>
{% endfor %}

<p class="research-meta">
    {% if site.author.google_scholar.size > 0 %}
    <a href="{{ site.author.google_scholar }}" rel="me noopener" target="_blank"><i class="fa fa-graduation-cap" aria-hidden="true"></i>Full List on Google Scholar</a>
    {% endif %}
    <!-- <a href="{{ '/publications.bib' | relative_url }}"><i class="fa fa-quote-right" aria-hidden="true"></i>Cite all ({{ site.data.publications.size }} BibTeX entries)</a> -->
    <span class="research-updated">Last Updated <time datetime="{{ page.updated | date: '%Y-%m' }}">{{ page.updated | date: '%B %Y' }}</time></span>
</p>
